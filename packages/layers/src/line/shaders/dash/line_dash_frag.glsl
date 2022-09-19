#define LineTypeSolid 0.0
uniform float u_opacity : 1.0;

varying vec4 v_color;

// dash
varying vec4 v_dash_array;

#pragma include "picking"

uniform float u_time;
uniform vec4 u_animate: [ 1., 2., 1.0, 0.2 ]; // 控制运动

varying mat4 styleMappingMat;
// [animate, duration, interval, trailLength],
void main() {
  float opacity = styleMappingMat[0][0];
  float d_distance_ratio = styleMappingMat[3].r; // 当前点位距离占线总长的比例
  gl_FragColor = v_color;
  gl_FragColor.a *= opacity; // 全局透明度
 
  float dashLength = mod(d_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
  if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
    // 实线部分
  } else {
    // 虚线部分
    discard;
  };

  gl_FragColor = filterColor(gl_FragColor);
}
