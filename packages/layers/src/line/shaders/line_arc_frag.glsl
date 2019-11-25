uniform float u_opacity;
varying vec4 v_color;
uniform float u_blur : 0.90;
varying vec2 v_normal;

#pragma include "picking"

void main() {
  gl_FragColor = v_color;
  float blur = 1.- smoothstep(u_blur, 1., length(v_normal.xy));
  gl_FragColor.a *= (blur * u_opacity);
  gl_FragColor = filterColor(gl_FragColor);
}
