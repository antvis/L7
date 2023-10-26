uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;
varying float v_distanceScale;
uniform float u_opacity: 1.0;
void main() {
  gl_FragColor = mix(u_sourceColor, u_targetColor, v_distanceScale);
  gl_FragColor.a *= u_opacity; // 全局透明度
}
