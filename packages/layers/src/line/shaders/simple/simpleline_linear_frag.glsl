uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;
uniform float opacity;
void main() {
  gl_FragColor = mix(u_sourceColor, u_targetColor, v_distanceScale);
  gl_FragColor.a *= opacity; // 全局透明度
}
