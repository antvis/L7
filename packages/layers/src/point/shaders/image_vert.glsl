precision highp float;
attribute vec3 a_Position;
attribute vec4 a_color;
attribute float a_size;
attribute float a_shape;
varying vec4 v_color;
varying vec2 v_uv;
#pragma include "projection"
void main() {
   v_color = a_color;
   vec4 project_pos = project_position(vec4(a_Position, 1.0));
   gl_Position = project_common_position_to_clipspace(vec4(project_pos, 1.0));
   gl_PointSize = a_size;
   v_uv = uv;
}