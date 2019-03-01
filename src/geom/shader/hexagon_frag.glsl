    precision highp float;
    uniform float u_opacity;
    varying vec4 v_color;
    void main() {
      vec4 color = v_color;
      gl_FragColor = color;
      gl_FragColor.a =color.a*u_opacity;
}