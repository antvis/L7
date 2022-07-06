varying vec4 v_color;
uniform float u_opacity: 1.0;

uniform float u_pickLight: 0.0;

#pragma include "picking"

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

uniform float u_opacitylinear: 0.0;
uniform float u_opacitylinear_dir: 1.0;

void main() {
  float opacity = styleMappingMat[0][0];
  float lightWeight = styleMappingMat[1][3];
  float barLinearZ = styleMappingMat[2][3];

  // 设置圆柱的底色
  if(u_linearColor == 1.0) { // 使用渐变颜色
    gl_FragColor = mix(u_sourceColor, u_targetColor, barLinearZ);
    gl_FragColor.rgb *= lightWeight;
  } else { // 使用 color 方法传入的颜色
     gl_FragColor = v_color;
  }

  // 应用透明度
  gl_FragColor.a *= opacity;

  // 开启透明度渐变
  if(u_opacitylinear > 0.0) {
    gl_FragColor.a *= u_opacitylinear_dir > 0.0 ? (1.0 - barLinearZ): barLinearZ;
  }

  // picking
  if(u_pickLight > 0.0) {
    gl_FragColor = filterColorAlpha(gl_FragColor, lightWeight);
  } else {
    gl_FragColor = filterColor(gl_FragColor);
  }
}
