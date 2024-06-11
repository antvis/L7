#define Animate 0.0
layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec2 a_Size;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_iconMapUV;
layout(location = ATTRIBUTE_LOCATION_DISTANCE_MITER_TOTAL) in vec3 a_Distance_Total_Miter;

layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_icon_step: 100;
  float u_heightfixed;
  float u_linearColor: 0;
  float u_line_texture;
  float u_textureBlend;
  float u_iconStepCount;
  float u_time;
};

// texV 线图层 - 贴图部分的 v 坐标（线的宽度方向）
out vec2 v_iconMapUV;
out vec4 v_color;
out float v_blur;
out vec4 v_dataset;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
  float a_Distance = a_Distance_Total_Miter.x;
  float a_Miter = a_Distance_Total_Miter.y;
  float a_Total_Distance = a_Distance_Total_Miter.z;

  float d_distance_ratio; // 当前点位距离占线总长的比例
  float d_texPixelLen; // 贴图的像素长度，根据地图层级缩放

  v_iconMapUV = a_iconMapUV;
  if (u_heightfixed < 1.0) {
    // 高度随 zoom 调整
    d_texPixelLen = project_pixel(u_icon_step);
  } else {
    d_texPixelLen = u_icon_step;
  }

  if (u_animate.x == Animate || u_linearColor == 1.0) {
    d_distance_ratio = a_Distance / a_Total_Distance;
  }

  float miter = (a_Miter + 1.0) / 2.0;
  // 设置数据集的参数
  v_dataset[0] = d_distance_ratio; // 当前点位距离占线总长的比例
  v_dataset[1] = a_Distance; // 当前顶点的距离
  v_dataset[2] = d_texPixelLen; // 贴图的像素长度，根据地图层级缩放
  v_dataset[3] = miter; // 线图层贴图部分的 v 坐标值 0 - 1

  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0), a_Position64Low);

  float originSize = a_Size.x; // 固定高度
  if (u_heightfixed < 1.0) {
    originSize = project_float_meter(a_Size.x); // 高度随 zoom 调整
  }

  float wallHeight = originSize * miter;
  float lightWeight = calc_lighting(vec4(project_pos.xy, wallHeight, 1.0));

  v_blur = min(project_float_pixel(2.0) / originSize, 0.05);
  v_color = vec4(a_Color.rgb * lightWeight, a_Color.w * opacity);

  // 兼容 mapbox 在线高度上的效果表现基本一致
  if (
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
  ) {
    // mapbox
    // 保持高度相对不变
    float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
    if (u_heightfixed > 0.0) {
      wallHeight *= mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, wallHeight, 1.0));

  setPickingColor(a_PickingColor);
}
