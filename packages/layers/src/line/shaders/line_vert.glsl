
attribute float a_miter;
attribute vec4 a_color;
attribute float a_size;
attribute float a_distance;
attribute float a_dash_array;
attribute float a_total_distance;
attribute vec3 a_normal;
attribute vec3 a_Position;
uniform mat4 u_ModelMatrix;

varying vec4 v_color;
varying float v_dash_array;
varying vec3 v_normal;
#pragma include "projection"
void main() {
  v_normal = a_normal;
  v_color = a_color;
  vec3 size = a_miter * a_size * v_normal;
  vec2 offset = project_pixel(size.xy);
  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0, 1.0));
}
