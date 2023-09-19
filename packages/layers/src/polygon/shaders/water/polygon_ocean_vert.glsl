attribute vec2 a_uv;
attribute vec3 a_Position;
uniform mat4 u_ModelMatrix;


varying vec2 v_uv;

#pragma include "projection"

void main() {
  v_uv = a_uv;

  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xyz, 1.0));
}

