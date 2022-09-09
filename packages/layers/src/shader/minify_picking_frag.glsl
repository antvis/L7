uniform float u_opacity : 1.0;
varying vec4 v_color;

#pragma include "picking"

void main() {
  gl_FragColor = v_color;
  gl_FragColor.a *= u_opacity;
  gl_FragColor = filterColor(gl_FragColor);
}
