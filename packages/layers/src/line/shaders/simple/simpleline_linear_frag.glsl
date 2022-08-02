uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

varying mat4 styleMappingMat;
void main() {
  float opacity = styleMappingMat[0][0];

  // styleMappingMat[3][0] 当前点位距离占线总长的比例
  gl_FragColor = mix(u_sourceColor, u_targetColor, styleMappingMat[3][0]);
  gl_FragColor.a *= opacity; // 全局透明度
}
