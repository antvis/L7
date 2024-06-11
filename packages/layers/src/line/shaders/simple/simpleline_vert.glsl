layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec4 a_SizeDistanceAndTotalDistance;

layout(std140) uniform commonUniorm {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec4 u_dash_array;
  float u_vertexScale: 1.0;
  float u_linearColor: 0;
};

#pragma include "projection"
#pragma include "picking"

out vec4 v_color;
out float v_distanceScale;
out vec4 v_dash_array;

void main() {
  //dash输出
  v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / a_SizeDistanceAndTotalDistance.a;

  v_color = a_Color;
  v_distanceScale = a_SizeDistanceAndTotalDistance.b / a_SizeDistanceAndTotalDistance.a;
  v_color.a = v_color.a * opacity;
  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0), a_Position64Low);

  float h = float(a_Position.z) * u_vertexScale; // 线顶点的高度 - 兼容不存在第三个数值的情况

  float lineHeight = a_SizeDistanceAndTotalDistance.y;
  // 兼容 mapbox 在线高度上的效果表现基本一致
  if (
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
  ) {
    // 保持高度相对不变
    h *= 2.0 / pow(2.0, 20.0 - u_Zoom);
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, lineHeight + h, 1.0));
  gl_PointSize = 10.0;

}
