varying vec4 v_dash_array;
varying vec4 v_color;
varying float v_distance_ratio;

uniform float segmentNumber;


#pragma include "picking"

void main() {
  gl_FragColor = v_color;

  float flag = 0.;
  float dashLength = mod(v_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
  if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
    flag = 1.;
  };
  gl_FragColor.a *=flag;
  
  gl_FragColor = filterColor(gl_FragColor);
}