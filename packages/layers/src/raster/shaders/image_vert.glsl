precision highp float;
varying vec2 v_texCoord;
uniform mat4 u_ModelMatrix;
attribute vec3 a_Position;
void main() {
   v_texCoord = uv;
   vec4 project_pos = project_position(vec4(a_Position, 1.0));
   gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
}