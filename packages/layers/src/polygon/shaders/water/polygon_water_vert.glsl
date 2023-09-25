attribute vec4 a_Color;
attribute vec2 a_uv;
attribute vec3 a_Position;
uniform mat4 u_ModelMatrix;


varying vec4 v_Color;
varying vec2 v_uv;
uniform float u_opacity: 1.0;


#pragma include "projection"

void main() {
  v_uv = a_uv;

  v_Color = a_Color;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xyz, 1.0));
}

