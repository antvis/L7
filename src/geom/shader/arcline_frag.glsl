  precision mediump float;
  uniform float u_opacity;
  varying vec4 v_color;
  
  void main() {
      if(v_color.a == 0.){
        discard;
      }
      #pragma include "pick"
      gl_FragColor = v_color;
      gl_FragColor.a = v_color.a*u_opacity;

  }