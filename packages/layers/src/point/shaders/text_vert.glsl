attribute vec3 a_Position;
attribute vec2 a_tex;
attribute vec2 a_offset;
attribute vec4 a_color;
attribute float a_size;

uniform vec2 u_sdf_map_size;
uniform vec2 u_viewport_size;

uniform float u_activeId : 0;
uniform vec4 u_activeColor : [1.0, 0.0, 0.0, 1.0];

varying vec2 v_uv;
varying float v_gamma_scale;
varying vec4 v_color;

#pragma include "projection"

void main() {
  v_color = a_color;
  v_uv = a_tex / u_sdf_map_size;

  // 文本缩放比例
  float fontScale = a_size / 24.;

  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  vec4 projected_position  = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  gl_Position = vec4(projected_position.xy / projected_position.w
    + a_offset * fontScale / u_viewport_size * 2., 0.0, 1.0);
  v_gamma_scale = gl_Position.w;


}
