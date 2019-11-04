attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute float a_Size;
uniform mat4 u_ModelMatrix;

varying vec4 v_Color;

#pragma include "projection"
#pragma include "picking"
#pragma include "lighting"

void main() {
  vec4 project_pos = project_position(vec4(a_Position.xy, a_Position.z * a_Size, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  vec3 viewDir = normalize(u_CameraPosition - project_pos.xyz);
  vec3 normal = project_offset_normal(a_Normal);
  v_Color.rgb *= calc_lighting(a_Position, normal, viewDir);

  setPickingColor(a_PickingColor);
}

