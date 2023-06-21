varying vec4 v_color;
varying float v_lightWeight;
uniform float u_pickLight: 0.0;

#pragma include "picking"


void main() {

  gl_FragColor = v_color;
  // 开启透明度渐变
  // picking
  if(u_pickLight > 0.0) {
    gl_FragColor = filterColorAlpha(gl_FragColor, v_lightWeight);
  } else {
    gl_FragColor = filterColor(gl_FragColor);
  }
}
