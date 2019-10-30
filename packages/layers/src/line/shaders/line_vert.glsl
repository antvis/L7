
attribute float a_Miter;
attribute vec4 a_Color;
attribute float a_Size;
attribute float a_Distance;
attribute float a_dash_array;
attribute float a_total_distance;
attribute vec3 a_Normal;
attribute vec3 a_Position;
uniform mat4 u_ModelMatrix;

varying vec4 v_color;
varying float v_dash_array;
varying vec3 v_normal;
#pragma include "projection"
void main() {
  v_normal = a_Normal;
  v_color = a_Color;
  vec3 size = a_Miter * a_Size * v_normal;
  vec2 offset = project_pixel(size.xy);
  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0, 1.0));
}
