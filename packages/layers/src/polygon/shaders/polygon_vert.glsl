attribute vec4 a_color; 
attribute vec3 a_Position;
attribute vec3 a_normal;
uniform mat4 u_ModelMatrix;

varying vec4 v_color;

#pragma include "projection"
void main() {
  v_color = a_color;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
}

