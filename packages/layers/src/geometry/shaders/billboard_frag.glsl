
uniform sampler2D u_texture;
uniform float u_opacity;

varying vec3 v_Color;
varying vec2 v_uv;

#pragma include "picking"
void main() {
  gl_FragColor = texture2D(u_texture, vec2(v_uv.x, 1.0 - v_uv.y));
  gl_FragColor.a *= u_opacity;
  gl_FragColor = filterColor(gl_FragColor);
}
