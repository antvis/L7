uniform float u_opacity : 1.0;
uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
  gl_FragColor.a *= u_opacity;
}
