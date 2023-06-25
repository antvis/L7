
varying vec4 v_Color;
#pragma include "picking"
void main() {

  gl_FragColor = v_Color; // 全局透明度
  gl_FragColor = filterColor(gl_FragColor);
}
