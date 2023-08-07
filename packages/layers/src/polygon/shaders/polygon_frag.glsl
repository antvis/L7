varying vec4 v_color;
#pragma include "picking"

void main() {
  gl_FragColor = v_color;
  gl_FragColor = filterColor(gl_FragColor);
}
