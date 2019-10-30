precision highp float;
varying vec4 v_color;
uniform float u_Opacity: 0.1;
void main() {
  gl_FragColor = v_color;
  gl_FragColor.a *= u_Opacity;
}
