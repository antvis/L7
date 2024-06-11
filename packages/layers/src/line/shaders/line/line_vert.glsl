#define Animate (0.0)

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec2 a_Size;
layout(location = ATTRIBUTE_LOCATION_DISTANCE_INDEX) in vec3 a_DistanceAndIndexAndMiter;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec4 a_Normal_Total_Distance;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_iconMapUV;

layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array;
  vec4 u_blur;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_icon_step: 100;
  float u_heightfixed: 0.0;
  float u_vertexScale: 1.0;
  float u_raisingHeight: 0.0;
  float u_strokeWidth: 0.0;
  float u_textureBlend;
  float u_line_texture;
  float u_linearDir: 1.0;
  float u_linearColor: 0;
  float u_time;
};

out vec4 v_color;
out vec4 v_stroke;
//dash
out vec4 v_dash_array;
out float v_d_distance_ratio;
// texV 线图层 - 贴图部分的 v 坐标（线的宽度方向）
out vec2 v_iconMapUV;
out vec4 v_texture_data;

#pragma include "projection"
#pragma include "picking"

void main() {
  vec2 a_DistanceAndIndex = a_DistanceAndIndexAndMiter.xy;
  float a_Miter = a_DistanceAndIndexAndMiter.z;
  vec3 a_Normal = a_Normal_Total_Distance.xyz;
  float a_Total_Distance = a_Normal_Total_Distance.w;
  //dash输出
  v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / a_Total_Distance;
  v_d_distance_ratio = a_DistanceAndIndex.x / a_Total_Distance;

  // cal style mapping - 数据纹理映射部分的计算
  float d_texPixelLen; // 贴图的像素长度，根据地图层级缩放
  v_iconMapUV = a_iconMapUV;
  d_texPixelLen = project_float_pixel(u_icon_step);

  v_color = a_Color;
  v_color.a *= opacity;
  v_stroke = stroke;

  vec3 size = a_Miter * setPickingSize(a_Size.x) * a_Normal;

  vec2 offset = project_pixel(size.xy);

  float lineDistance = a_DistanceAndIndex.x;
  float currentLinePointRatio = lineDistance / a_Total_Distance;

  float lineOffsetWidth = length(offset + offset * sign(a_Miter)); // 线横向偏移的距离（向两侧偏移的和）
  float linePixelSize = project_pixel(a_Size.x) * 2.0; // 定点位置偏移，按地图等级缩放后的距离 单侧 * 2
  float texV = lineOffsetWidth / linePixelSize; // 线图层贴图部分的 v 坐标值

  v_texture_data = vec4(currentLinePointRatio, lineDistance, d_texPixelLen, texV);
  // 设置数据集的参数

  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0), a_Position64Low);

  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, a_Size.y, 1.0));

  float h = float(a_Position.z) * u_vertexScale; // 线顶点的高度 - 兼容不存在第三个数值的情况 vertex height
  float lineHeight = a_Size.y; // size 第二个参数代表的高度 [linewidth, lineheight]

  // 兼容 mapbox 在线高度上的效果表现基本一致
  if (
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
  ) {
    // mapbox
    // 保持高度相对不变
    float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
    h *= mapboxZoomScale;
    h += u_raisingHeight * mapboxZoomScale;
    if (u_heightfixed > 0.0) {
      lineHeight *= mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace(
    vec4(project_pos.xy + offset, lineHeight + h, 1.0)
  );

  setPickingColor(a_PickingColor);
}
