varying vec4 v_color;
uniform float u_linearDir: 1.0;
uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

#pragma include "picking"


varying mat4 styleMappingMat;

void main() {
  float opacity = styleMappingMat[0][0];
  float linearRadio = styleMappingMat[3][0]; // 当前点位距离占线总长的比例
  if(u_linearDir < 1.0) {
    linearRadio = styleMappingMat[3][3];
  }

  if(u_linearColor == 1.0) { // 使用渐变颜色
    gl_FragColor = mix(u_sourceColor, u_targetColor, linearRadio);
  } else { // 使用 color 方法传入的颜色
     gl_FragColor = v_color;
  }

  gl_FragColor.a *= opacity; // 全局透明度
  gl_FragColor = filterColor(gl_FragColor);
}
