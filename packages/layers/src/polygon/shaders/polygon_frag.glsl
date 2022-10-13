uniform float u_opacity: 1.0;
varying vec4 v_color;
varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

#pragma include "picking"

void main() {
  float opacity = styleMappingMat[0][0];
  gl_FragColor = v_color;
  gl_FragColor.a *= opacity;
  gl_FragColor = filterColor(gl_FragColor);
}
