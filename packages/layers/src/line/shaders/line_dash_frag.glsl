uniform float u_blur : 0.9;
uniform float u_opacity : 1.0;
uniform float u_dash_offset : 0.0;
uniform float u_dash_ratio : 0.1;
varying vec4 v_color;
varying vec2 v_normal;

uniform float u_time;
uniform vec3 u_aimate: [ 0, 2., 1.0, 0.2 ];

varying float v_distance_ratio;
varying vec2 v_dash_array;
void main() {
   gl_FragColor = v_color;
  //  gl_FragColor.a = v_distance_ratio;
  // anti-alias
  // float blur = 1.- smoothstep(u_blur, 1., length(v_normal.xy)) * u_opacity;
  // gl_FragColor.a *= blur  * ceil(mod(v_distance_ratio, v_dash_array.x) - v_dash_array.y);
  gl_FragColor.a *= u_opacity  * (1.0- step(v_dash_array.x, mod(v_distance_ratio, v_dash_array.x +v_dash_array.y)));


}
