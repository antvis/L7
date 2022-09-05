uniform float u_opacity;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
  gl_FragColor.a *= u_opacity;
}
