precision highp float;
uniform mat4 u_ModelMatrix;
attribute vec3 a_Position;
attribute vec2 a_uv;
varying vec2 v_texCoord;

#pragma include "projection"
void main() {
   v_texCoord = a_uv;
   vec4 project_pos = project_position(vec4(a_Position, 1.0));
   gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy,0., 1.0));
}