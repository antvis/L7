uniform float u_blur : 0.9;
uniform float u_opacity : 1.0;
uniform float u_dash_offset : 0.0;
uniform float u_dash_ratio : 0.0;
varying vec4 v_color;
varying vec2 v_normal;

varying float v_distance_ratio;
varying float v_dash_array;
void main() {
   gl_FragColor = v_color;
  // anti-alias
  float blur = 1.- smoothstep(u_blur, 1., length(v_normal.xy)) * u_opacity;
  gl_FragColor.a *= blur;

}
