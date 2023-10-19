layout(std140) uniform ModelUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec4 u_dash_array;
  vec2 u_textSize;
  float u_thetaOffset;
  float u_opacity;
  float u_textureBlend;
  float segmentNumber;
  float u_line_type;
  float u_blur;
  float u_lineDir;
  float u_line_texture;
  float u_icon_step;
  float u_linearColor;
};

in vec4 v_color;

out vec4 outputColor;

#pragma include "picking"

void main() {
// 当前顶点在弧线中所处的分段位置

  outputColor = v_color;
  outputColor = filterColor(gl_FragColor);
}