  precision mediump float;
  uniform float u_Opacity;
  varying vec4 v_color;

  void main() {

      gl_FragColor = v_color;
      gl_FragColor.a = v_color.a * u_Opacity;

  }
