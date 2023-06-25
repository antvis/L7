#pragma include "picking"
uniform float u_opacitylinear: 0.0;
uniform float u_dir: 1.0;
varying vec3 v_linear;
varying vec2 v_pos;


void main() {
  
  if(u_opacitylinear > 0.0) {
    gl_FragColor.a *= u_dir == 1.0 ? 1.0 - length(v_pos - v_linear.xy)/v_linear.z : length(v_pos - v_linear.xy)/v_linear.z;
  }
  gl_FragColor = filterColor(gl_FragColor);
}
