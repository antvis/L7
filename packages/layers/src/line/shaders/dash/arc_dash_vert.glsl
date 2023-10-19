layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 7) in float a_Size;
layout(location = 8) in vec4 a_Instance;

layout(std140) uniform ModelUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec4 u_dash_array;
  vec2 u_textSize;
  float u_thetaOffset;
  float u_opacity;
  float u_textureBlend;
  float segmentNumber;
  float u_line_type;
  float u_blur;
  float u_lineDir;
  float u_line_texture;
  float u_icon_step;
  float u_linearColor;
};

out vec4 v_color;
out vec4 v_dash_array;
out float v_distance_ratio;

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

float bezier3(vec3 arr, float t) {
  float ut = 1. - t;
  return (arr.x * ut + arr.y * t) * ut + (arr.y * ut + arr.z * t) * t;
}
vec2 midPoint(vec2 source, vec2 target, float arcThetaOffset) {
  vec2 center = target - source;
  float r = length(center);
  float theta = atan(center.y, center.x);
  float thetaOffset = arcThetaOffset;
  float r2 = r / 2.0 / cos(thetaOffset);
  float theta2 = theta + thetaOffset;
  vec2 mid = vec2(r2*cos(theta2) + source.x, r2*sin(theta2) + source.y);
  if(u_lineDir == 1.0) { // 正向
    return mid;
  } else { // 逆向
    // (mid + vmin)/2 = (s + t)/2
    vec2 vmid = source + target - mid;
    return vmid;
  }
  // return mid;
}
float getSegmentRatio(float index) {
  // dash: index / (segmentNumber - 1.);
  // normal: smoothstep(0.0, 1.0, index / (segmentNumber - 1.));
  return index / (segmentNumber - 1.);
}
vec2 interpolate (vec2 source, vec2 target, float t, float arcThetaOffset) {
  // if the angularDist is PI, linear interpolation is applied. otherwise, use spherical interpolation
  vec2 mid = midPoint(source, target, arcThetaOffset);
  vec3 x = vec3(source.x, mid.x, target.x);
  vec3 y = vec3(source.y, mid.y, target.y);
  return vec2(bezier3(x ,t), bezier3(y,t));
}
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
   dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
  vec2 offset = dir_screenspace * offset_direction * setPickingSize(a_Size) / 2.0;
  return offset;
}
vec2 getNormal(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
   dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
   return reverse_offset_normal(vec3(dir_screenspace,1.0)).xy * sign(offset_direction);
}

void main() {
  v_color = vec4(a_Color.xyz, a_Color.w * u_opacity);
  
  vec2 source = a_Instance.rg;  // 起始点
  vec2 target =  a_Instance.ba; // 终点
  float segmentIndex = a_Position.x;
  float segmentRatio = getSegmentRatio(segmentIndex);

  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);

  vec2 s = source;
  vec2 t = target;
  
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    s = unProjCustomCoord(source);
    t = unProjCustomCoord(target);
  }
  float total_Distance = pixelDistance(s, t) / 2.0 * PI;
  v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / total_Distance;

  v_distance_ratio = segmentIndex / segmentNumber;

  vec4 curr = project_position(vec4(interpolate(source, target, segmentRatio, u_thetaOffset), 0.0, 1.0));
  vec4 next = project_position(vec4(interpolate(source, target, nextSegmentRatio, u_thetaOffset), 0.0, 1.0));
 
  
  vec2 offset = project_pixel(getExtrusionOffset((next.xy - curr.xy) * indexDir, a_Position.y));

  gl_Position = project_common_position_to_clipspace_v2(vec4(curr.xy + offset, 0, 1.0));

  gl_PointSize = 5.0;
  setPickingColor(a_PickingColor);
}
