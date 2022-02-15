
uniform float u_opacity;

varying vec4 v_dash_array;
varying vec4 v_color;

uniform float segmentNumber;

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

#pragma include "picking"

void main() {
  float opacity = styleMappingMat[0][0];
  float d_distance_ratio = styleMappingMat[3].b; // 当前顶点在弧线中所处的分段比例

  gl_FragColor = v_color;
  gl_FragColor.a *= opacity;

  float flag = 0.;
  float dashLength = mod(d_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
  if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
    flag = 1.;
  }
  gl_FragColor.a *=flag;
  
  gl_FragColor = filterColor(gl_FragColor);
}