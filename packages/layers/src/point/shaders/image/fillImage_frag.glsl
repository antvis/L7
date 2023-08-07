uniform sampler2D u_texture;
uniform vec2 u_textSize;
uniform float u_opacity : 1;

#pragma include "sdf_2d"
#pragma include "picking"
varying vec2 v_uv; // 本身的 uv 坐标
varying vec2 v_Iconuv;

void main() {

  vec2 pos = v_Iconuv / u_textSize + v_uv / u_textSize * 64.;
  gl_FragColor = texture2D(u_texture, pos);
  gl_FragColor.a *= u_opacity;

  gl_FragColor = filterColor(gl_FragColor);
}
