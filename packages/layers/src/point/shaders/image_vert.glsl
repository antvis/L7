precision highp float;
attribute vec3 a_Position;
attribute vec4 a_color;
attribute vec2 a_uv;
attribute float a_size;
attribute float a_shape;
varying vec4 v_color;
varying vec2 v_uv;
uniform mat4 u_ModelMatrix;
#pragma include "projection"
void main() {
   v_color = a_color;
    v_uv = a_uv;
   vec4 project_pos = project_position(vec4(a_Position, 1.0));
   gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
   gl_PointSize = a_size;
  
}