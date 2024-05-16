#define Animate (0.0)
#define LineTexture (1.0)

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_INSTANCE) in vec4 a_Instance;
layout(location = ATTRIBUTE_LOCATION_INSTANCE_64LOW) in vec4 a_Instance64Low;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_iconMapUV;

layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float segmentNumber;
  float u_lineDir: 1.0;
  float u_icon_step: 100;
  float u_line_texture: 0.0;
  float u_textureBlend;
  float u_blur : 0.9;
  float u_line_type: 0.0;
  float u_time;
  float u_linearColor: 0.0;
};

out vec4 v_color;
out vec2 v_iconMapUV;
out vec4 v_lineData;
//dash
out vec4 v_dash_array;
out float v_distance_ratio;

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

float bezier3(vec3 arr, float t) {
  float ut = 1.0 - t;
  return (arr.x * ut + arr.y * t) * ut + (arr.y * ut + arr.z * t) * t;
}
vec2 midPoint(vec2 source, vec2 target, float arcThetaOffset) {
  vec2 center = target - source;
  float r = length(center);
  float theta = atan(center.y, center.x);
  float thetaOffset = arcThetaOffset;
  float r2 = r / 2.0 / cos(thetaOffset);
  float theta2 = theta + thetaOffset;
  vec2 mid = vec2(r2 * cos(theta2) + source.x, r2 * sin(theta2) + source.y);
  if (u_lineDir == 1.0) {
    // 正向
    return mid;
  } else {
    // 逆向
    // (mid + vmin)/2 = (s + t)/2
    vec2 vmid = source + target - mid;
    return vmid;
  }
  // return mid;
}
float getSegmentRatio(float index) {
  // dash: index / (segmentNumber - 1.);
  // normal: smoothstep(0.0, 1.0, index / (segmentNumber - 1.));
  return smoothstep(0.0, 1.0, index / (segmentNumber - 1.0));
  //  return index / (segmentNumber - 1.);
}
vec2 interpolate(vec2 source, vec2 target, float t, float arcThetaOffset) {
  // if the angularDist is PI, linear interpolation is applied. otherwise, use spherical interpolation
  vec2 mid = midPoint(source, target, arcThetaOffset);
  vec3 x = vec3(source.x, mid.x, target.x);
  vec3 y = vec3(source.y, mid.y, target.y);
  return vec2(bezier3(x, t), bezier3(y, t));
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
   return dir_screenspace.xy * sign(offset_direction);
}

void main() {
  //vs中计算渐变色
  if (u_linearColor == 1.0) {
    float d_segmentIndex = a_Position.x + 1.0; // 当前顶点在弧线中所处的分段位置
    v_color = mix(u_sourceColor, u_targetColor, d_segmentIndex / segmentNumber);
  } else {
    v_color = a_Color;
  }
  v_color.a = v_color.a * opacity;

  vec2 source_world = a_Instance.rg; // 起始点
  vec2 target_world = a_Instance.ba; // 终点

  float segmentIndex = a_Position.x;
  float segmentRatio = getSegmentRatio(segmentIndex);

  // 计算 dashArray 和 distanceRatio 输出到片元
  float total_Distance = pixelDistance(source_world, target_world) / 2.0 * PI;
  v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / total_Distance;
  v_distance_ratio = segmentIndex / segmentNumber;

  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
  float d_distance_ratio;

  if(u_animate.x == Animate) {
      d_distance_ratio = segmentIndex / segmentNumber;
      if(u_lineDir != 1.0) {
        d_distance_ratio = 1.0 - d_distance_ratio;
      }
  }

  v_lineData.b = d_distance_ratio;

  vec4 source = project_position(vec4(source_world, 0, 1.), a_Instance64Low.xy);
  vec4 target = project_position(vec4(target_world, 0, 1.), a_Instance64Low.zw);

  vec2 currPos = interpolate(source.xy, target.xy, segmentRatio, thetaOffset);
  vec2 nextPos = interpolate(source.xy, target.xy, nextSegmentRatio, thetaOffset);

  vec2 offset = project_pixel(
    getExtrusionOffset((nextPos.xy - currPos.xy) * indexDir, a_Position.y)
  );

  float d_segmentIndex = a_Position.x + 1.0; // 当前顶点在弧线中所处的分段位置
  v_lineData.r = d_segmentIndex;

  if(LineTexture == u_line_texture) { // 开启贴图模式
    float arcDistrance = length(source - target); // 起始点和终点的距离
    arcDistrance = project_pixel(arcDistrance);

    v_iconMapUV = a_iconMapUV;

    float pixelLen = project_pixel_texture(u_icon_step); // 贴图沿弧线方向的长度 - 随地图缩放改变
    float texCount = floor(arcDistrance / pixelLen); // 贴图在弧线上重复的数量
    v_lineData.g = texCount;

    float lineOffsetWidth = length(offset + offset * sign(a_Position.y)); // 线横向偏移的距离
    float linePixelSize = project_pixel(a_Size); // 定点位置偏移
    v_lineData.a = lineOffsetWidth / linePixelSize; // 线图层贴图部分的 v 坐标值
  }

  gl_Position = project_common_position_to_clipspace(vec4(currPos.xy + offset, 0, 1.0));

  setPickingColor(a_PickingColor);
}
