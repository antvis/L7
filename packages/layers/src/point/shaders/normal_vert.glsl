
attribute vec3 a_Position;
uniform mat4 u_ModelMatrix;
attribute float a_Size;
attribute vec4 a_Color;
varying vec4 v_color;

uniform vec2 u_offsets;

#pragma include "projection"
#pragma include "picking"
void main() {
  v_color = a_Color;
  vec2 offset = project_pixel(u_offsets);
  vec4 project_pos = project_position(vec4(a_Position, 1.0)) + vec4(a_Size / 2.,-a_Size /2.,0.,0.);
  gl_Position = project_common_position_to_clipspace(vec4(vec2(project_pos.xy+offset),project_pos.z,project_pos.w));
  gl_PointSize = a_Size * 2.0 * u_DevicePixelRatio;
    setPickingColor(a_PickingColor);
}
