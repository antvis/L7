uniform float u_opacity : 1;
varying vec4 v_color;
void main() {
  gl_FragColor = v_color;
  gl_FragColor.a *= u_opacity;
}
