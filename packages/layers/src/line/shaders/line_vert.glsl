
attribute float a_Miter;
attribute vec4 a_Color;
attribute float a_Size;
attribute vec3 a_Normal;
attribute vec3 a_Position;
uniform mat4 u_ModelMatrix;
#pragma include "projection"
varying vec4 v_color;
varying float v_dash_array;
varying vec2 v_normal;
void main() {
  v_normal = vec2(reverse_offset_normal(a_Normal) * sign(a_Miter));
  v_color = a_Color;
  vec3 size = a_Miter * a_Size * reverse_offset_normal(a_Normal);  //v_normal * vec3(1., -1., 1.0);
  vec2 offset = project_pixel(size.xy);
  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0, 1.0));
}
