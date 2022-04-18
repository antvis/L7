uniform float u_opacity: 1.0;
varying vec4 v_Color;
varying mat4 styleMappingMat; // 传递从片元中传递的映射数据
#pragma include "picking"
varying float v_lightWeight;

void main() {
  float opacity = styleMappingMat[0][0];
  gl_FragColor = v_Color;
  // gl_FragColor.a *= u_opacity;
  gl_FragColor.a *= opacity;
  gl_FragColor = filterColorAlpha(gl_FragColor, v_lightWeight);
}
