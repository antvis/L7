precision highp float;

uniform float u_opacity : 1.0;
uniform float u_dash_offset : 0.0;
uniform float u_dash_ratio : 0.0;
uniform float u_blur : 0.9;

varying vec4 v_color;
varying float v_distance;
varying float v_dash_array;
varying float v_time;
varying vec2 v_normal;

void main() {
  gl_FragColor = v_color;
  #ifdef DASHLINE
    gl_FragColor.a *= u_opacity * ceil(mod(v_distance + u_dash_offset, v_dash_array) - (v_dash_array * u_dash_ratio));
  #else
    gl_FragColor.a =  v_color.a * u_opacity;
  #endif
  #ifdef ANIMATE 
    gl_FragColor.a *= v_time;
  #endif

  // anti-alias
  float blur = 1. - smoothstep(u_blur, 1., length(v_normal));
  gl_FragColor.a *= blur;
}
