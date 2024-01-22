layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 15) in vec3 a_linear;

layout(std140) uniform commonUniforms {
  float u_raisingHeight;
  float u_opacitylinear;
  float u_dir;
};

out vec4 v_color;
out vec3 v_linear;
out vec2 v_pos;

#pragma include "projection"
#pragma include "picking"

void main() {
  if (u_opacitylinear > 0.0) {
    v_linear = a_linear;
    v_pos = a_Position.xy;
  }
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  project_pos.z += u_raisingHeight;

  if (u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
    float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
    project_pos.z *= mapboxZoomScale;
    project_pos.z += u_raisingHeight * mapboxZoomScale;
  }

  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xyz, 1.0));
  setPickingColor(a_PickingColor);
}