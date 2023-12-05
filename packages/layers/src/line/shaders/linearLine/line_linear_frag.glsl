
in vec4 v_Color;
layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_blur;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_icon_step: 100;
  float u_heightfixed: 0.0;
  float u_vertexScale: 1.0;
  float u_raisingHeight: 0.0;
  float u_arrow: 0.0;
  float u_arrowHeight: 3.0;
  float u_arrowWidth: 2.0;
  float u_tailWidth: 1.0;
  float u_strokeWidth: 0.0;
  float u_textureBlend;
  float u_line_texture;
  float u_time;
};
out vec4 outputColor;
#pragma include "picking"
void main() {
  outputColor = v_Color; // 全局透明度
  outputColor = filterColor(outputColor);
}
