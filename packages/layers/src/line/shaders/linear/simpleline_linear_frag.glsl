uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

varying mat4 styleMappingMat;
void main() {
  float opacity = styleMappingMat[0][0];
  float d_distance_ratio = styleMappingMat[3].r; // 当前点位距离占线总长的比例

  gl_FragColor = mix(u_sourceColor, u_targetColor, d_distance_ratio);
  gl_FragColor.a *= opacity; // 全局透明度
}
