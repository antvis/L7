attribute vec2 a_pos;
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

void main() {
  v_color = a_color;
  v_uv = a_tex / u_sdf_map_size;

  // 文本缩放比例
  float fontScale = a_size / 24.;

  // 投影到屏幕空间 + 偏移量
  vec4 projected_position = projectionMatrix * modelViewMatrix * vec4(a_pos, 0., 1.);
  gl_Position = vec4(projected_position.xy / projected_position.w
    + a_offset * fontScale / u_viewport_size * 2., 0.0, 1.0);

  v_gamma_scale = gl_Position.w;

  if (pickingId == u_activeId) {
    v_color = u_activeColor;
  }
  worldId = id_toPickColor(pickingId);
}
