in vec4 v_color;
out vec4 outputColor;
#pragma include "picking"

void main() {
// 当前顶点在弧线中所处的分段位置
  outputColor = v_color;
  outputColor = filterColor(outputColor);
}