
attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec4 a_Instance;
attribute float a_Size;
uniform mat4 u_ModelMatrix;

uniform float segmentNumber;
varying vec4 v_color;
varying float v_segmentIndex;

uniform float u_lineDir: 1.0;

uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;




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
    return smoothstep(0.0, 1.0, index / (segmentNumber - 1.));
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
  v_color = a_Color;

  vec2 source = a_Instance.rg;  // 起始点
  vec2 target =  a_Instance.ba; // 终点
  float segmentIndex = a_Position.x;
  float segmentRatio = getSegmentRatio(segmentIndex);

  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
  float d_distance_ratio;
  vec4 curr = project_position(vec4(interpolate(source, target, segmentRatio, thetaOffset), 0.0, 1.0));
  vec4 next = project_position(vec4(interpolate(source, target, nextSegmentRatio, thetaOffset), 0.0, 1.0));
  // v_normal = getNormal((next.xy - curr.xy) * indexDir, a_Position.y);
  //unProjCustomCoord
  
  vec2 offset = project_pixel(getExtrusionOffset((next.xy - curr.xy) * indexDir, a_Position.y));


  float d_segmentIndex = a_Position.x + 1.0; // 当前顶点在弧线中所处的分段位置

  v_color = mix(u_sourceColor, u_targetColor, d_segmentIndex/segmentNumber);
  v_color.a *= opacity;

  gl_Position = project_common_position_to_clipspace_v2(vec4(curr.xy + offset, 0, 1.0));

  setPickingColor(a_PickingColor);
}
