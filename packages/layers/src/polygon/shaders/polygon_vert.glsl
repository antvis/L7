attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute float a_Size;
uniform mat4 u_ModelMatrix;

varying vec4 v_Color;

#pragma include "projection"
#pragma include "picking"

void main() {
  v_Color = vec4(a_Normal,1.0);
  vec4 project_pos = project_position(vec4(a_Position.xy,a_Position.z * a_Size, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  setPickingColor(a_PickingColor);
}

