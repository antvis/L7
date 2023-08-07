varying vec4 v_color;

#pragma include "picking"

void main() {
// 当前顶点在弧线中所处的分段位置

  gl_FragColor = v_color;
  gl_FragColor = filterColor(gl_FragColor);
}