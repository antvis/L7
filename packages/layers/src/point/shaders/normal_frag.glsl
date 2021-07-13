
uniform float u_opacity : 1;
uniform vec2 u_offsets;
varying vec4 v_color;
varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

#pragma include "picking"
void main() {
  float opacity = styleMappingMat[0][0];

  gl_FragColor = v_color;
  // gl_FragColor.a =gl_FragColor.a * u_opacity;
  gl_FragColor.a =gl_FragColor.a * opacity;
  gl_FragColor = filterColor(gl_FragColor);
}
