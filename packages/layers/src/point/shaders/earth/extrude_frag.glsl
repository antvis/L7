varying vec4 v_color;
uniform float u_opacity: 1.0;

uniform float u_pickLight: 0.0;

#pragma include "picking"


uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

uniform float u_opacitylinear: 0.0;
uniform float u_opacitylinear_dir: 1.0;
varying float v_lightWeight;
varying float v_barLinearZ;
void main() {

   gl_FragColor = v_color;

  // 开启透明度渐变
  if(u_opacitylinear > 0.0) {
    gl_FragColor.a *= u_opacitylinear_dir > 0.0 ? (1.0 - v_barLinearZ): v_barLinearZ;
  }

  // picking
  if(u_pickLight > 0.0) {
    gl_FragColor = filterColorAlpha(gl_FragColor, v_lightWeight);
  } else {
    gl_FragColor = filterColor(gl_FragColor);
  }
}
