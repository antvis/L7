#define LineTypeSolid 0.0
varying vec4 v_color;

// dash
varying vec4 v_dash_array;
varying float v_d_distance_ratio;

#pragma include "picking"

uniform float u_time;
uniform vec4 u_animate: [ 1., 2., 1.0, 0.2 ]; // 控制运动

// [animate, duration, interval, trailLength],
void main() {

  gl_FragColor = v_color;

  float dashLength = mod(v_d_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
  if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
    // 实线部分
  } else {
    // 虚线部分
    discard;
  };

  gl_FragColor = filterColor(gl_FragColor);
}
