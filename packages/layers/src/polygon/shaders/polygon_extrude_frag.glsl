uniform float u_Opacity: 1.0;
varying vec4 v_Color;

#pragma include "picking"

void main() {
  gl_FragColor = v_Color;
  gl_FragColor.a *= u_Opacity;
  gl_FragColor = filterColor(gl_FragColor);
}
