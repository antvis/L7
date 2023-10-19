layout(std140) uniform ModelUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_opacity;
  float u_vertexScale;
  float u_linearColor;
};

out vec4 outputColor;

in float v_distanceScale;

void main() {
  outputColor = mix(u_sourceColor, u_targetColor, v_distanceScale);
  outputColor.a *= opacity; // 全局透明度
}
