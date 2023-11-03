uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;
varying float v_distanceScale;
varying vec4 v_color;
void main() {
  gl_FragColor = mix(u_sourceColor, u_targetColor, v_distanceScale);
  gl_FragColor.a *= v_color.a; // 全局透明度
}
