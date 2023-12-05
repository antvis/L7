in vec4 v_color;
in vec4 v_texture_data;
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
  float u_linearDir: 1.0;
  float u_linearColor: 0;
  float u_time;
};
out vec4 outputColor;
#pragma include "picking"


void main() {
  float linearRadio = v_texture_data.r; // 当前点位距离占线总长的比例
  if(u_linearDir < 1.0) {
    linearRadio = v_texture_data.a;
  }

  if(u_linearColor == 1.0) { // 使用渐变颜色
    outputColor = mix(u_sourceColor, u_targetColor, linearRadio);
    outputColor.a *= v_color.a;
  } else { // 使用 color 方法传入的颜色
     outputColor = v_color;
  }

  outputColor = filterColor(outputColor);
}
