
attribute vec3 a_Position;
uniform mat4 u_ModelMatrix;
attribute float a_Size;
attribute vec4 a_Color;
varying vec4 v_color;

#pragma include "projection"
#pragma include "picking"

void main() {
  v_color = a_Color;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  gl_Position = project_common_position_to_clipspace(project_pos);
  gl_PointSize = a_Size * 2.0 * u_DevicePixelRatio;
  setPickingColor(a_PickingColor);
}
