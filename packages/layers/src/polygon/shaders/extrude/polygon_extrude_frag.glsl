uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;
uniform float u_linearColor: 0;

uniform float u_topsurface: 1.0;
uniform float u_sidesurface: 1.0;

varying vec4 v_Color;

#pragma include "picking"

void main() {


     // top face
    if(u_topsurface < 1.0) {
      discard;
    }

    gl_FragColor = v_Color;
  

  gl_FragColor = filterColor(gl_FragColor);
}
