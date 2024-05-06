layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec3 a_Extrude;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  vec2 u_size;
  float u_raisingHeight;
  float u_rotation;
  float u_opacity;
};

out vec2 v_uv;

#pragma include "projection"
#pragma include "picking"
#pragma include "rotation_2d"
void main() {
  vec3 extrude = a_Extrude;
  v_uv = a_Uv;
  float raiseHeight = u_raisingHeight;
  if (
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
  ) {
    float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
    raiseHeight = u_raisingHeight * mapboxZoomScale;
  }

  // 计算经纬度点位坐标
  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

  // 计算绕 z 轴旋转后的偏移
  vec2 offsetXY = project_pixel(rotate_matrix(vec2(extrude.x * u_size.x, 0.0), u_rotation));
  // 绕 z 轴旋转
  float x = project_pos.x + offsetXY.x;
  float y = project_pos.y + offsetXY.y;
  // z 轴不参与旋转
  float z = project_pixel(extrude.y * u_size.y + raiseHeight);

  gl_Position = project_common_position_to_clipspace(vec4(x, y, z, 1.0));

  setPickingColor(a_PickingColor);
}
