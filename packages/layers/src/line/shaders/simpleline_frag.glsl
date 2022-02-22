
varying vec4 v_color;
varying mat4 styleMappingMat;
void main() {
  float opacity = styleMappingMat[0][0];
  float d_distance_ratio = styleMappingMat[3].r; // 当前点位距离占线总长的比例

  gl_FragColor = v_color;
  gl_FragColor.a *= opacity; // 全局透明度
}
