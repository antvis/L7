varying vec4 v_color;
varying vec4 v_texture_data;
uniform float u_linearDir: 1.0;
uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

#pragma include "picking"


void main() {
  float linearRadio = v_texture_data.r; // 当前点位距离占线总长的比例
  if(u_linearDir < 1.0) {
    linearRadio = v_texture_data.a;
  }

  if(u_linearColor == 1.0) { // 使用渐变颜色
    gl_FragColor = mix(u_sourceColor, u_targetColor, linearRadio);
    gl_FragColor.a *= v_color.a;
  } else { // 使用 color 方法传入的颜色
     gl_FragColor = v_color;
  }

  gl_FragColor = filterColor(gl_FragColor);
}
