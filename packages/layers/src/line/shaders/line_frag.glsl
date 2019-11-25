uniform float u_blur : 0.9;
uniform float u_opacity : 1.0;
uniform float u_dash_offset : 0.0;
uniform float u_dash_ratio : 0.0;
varying vec4 v_color;
varying vec2 v_normal;

#pragma include "picking"

uniform float u_time;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];
// [animate, duration, interval, trailLength],
varying float v_distance_ratio;
varying float v_dash_array;
void main() {
  gl_FragColor = v_color;
  // anti-alias
  float blur = 1.- smoothstep(u_blur, 1., length(v_normal.xy)) * u_opacity;
  // gl_FragColor.a *= blur;

  #ifdef ANIMATE
    float alpha =1.0 - fract( mod(1.0- v_distance_ratio,u_aimate.z)* (1.0/ u_aimate.z) + u_time / u_aimate.y);
    alpha = (alpha + u_aimate.w -1.0) / u_aimate.w;
    alpha = smoothstep(0., 1., alpha);
    gl_FragColor.a *= alpha * blur;
  #endif

  gl_FragColor = filterColor(gl_FragColor);
}
