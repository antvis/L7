in float v_distanceScale;
in vec4 v_color;
layout(std140) uniform commonUniorm {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_vertexScale: 1.0;
};
out vec4 outputColor;
void main() {
  outputColor = mix(u_sourceColor, u_targetColor, v_distanceScale);
  outputColor.a *= v_color.a; // 全局透明度
}
