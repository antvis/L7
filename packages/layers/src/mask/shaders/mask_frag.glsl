uniform float u_opacity;
varying vec4 v_Color;

void main() {
  gl_FragColor = v_Color;
  gl_FragColor.a *= u_opacity;
}
