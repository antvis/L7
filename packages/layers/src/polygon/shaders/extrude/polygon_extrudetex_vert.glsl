layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec3 a_uvs;

layout(std140) uniform commonUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed; // 默认不固定
  float u_raisingHeight;
};

out vec4 v_Color;
out vec3 v_uvs;
out vec2 v_texture_data;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size, 1.0);
  vec4 project_pos = project_position(pos, a_Position64Low);
  float lightWeight = calc_lighting(project_pos);
  v_uvs = a_uvs;
  v_Color = a_Color;
  v_Color.a *= opacity;

  v_texture_data = vec2(a_Position.z, lightWeight);

  if (u_heightfixed > 0.0) {
    // 判断几何体是否固定高度
    project_pos.z = a_Position.z * a_Size;
    project_pos.z += u_raisingHeight;

    if (
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
    ) {
      float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
      project_pos.z *= mapboxZoomScale;
      project_pos.z += u_raisingHeight * mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  setPickingColor(a_PickingColor);
}
