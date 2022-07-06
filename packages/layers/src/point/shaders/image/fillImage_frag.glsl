uniform sampler2D u_texture;
uniform vec2 u_textSize;

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

#pragma include "sdf_2d"
#pragma include "picking"
varying vec2 v_uv; // 本身的 uv 坐标
varying vec2 v_Iconuv;

void main() {

  float opacity = styleMappingMat[0][0];

  vec2 pos = v_Iconuv / u_textSize + v_uv / u_textSize * 64.;
  gl_FragColor = texture2D(u_texture, pos);
  gl_FragColor.a *= opacity;

  gl_FragColor = filterColor(gl_FragColor);
}
