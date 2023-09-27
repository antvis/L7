
uniform float u_opacity: 1.0;
varying vec4 v_Color;
varying vec2 v_texture_data;


#pragma include "picking"

void main() {

  gl_FragColor = v_Color;
  gl_FragColor = filterColor(gl_FragColor);
}
