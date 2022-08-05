uniform float u_opacity : 1.0;
uniform sampler2D u_texture;
uniform float u_linearDir: 1.0;

#pragma include "picking"

varying mat4 styleMappingMat;

void main() {
  float opacity = styleMappingMat[0][0];
  float linearRadio = styleMappingMat[3].r; // 当前点位距离占线总长的比例
  if(u_linearDir < 1.0) {
    linearRadio = styleMappingMat[3][3];
  }

  gl_FragColor = texture2D(u_texture, vec2(linearRadio, 0.5));

  gl_FragColor.a *= opacity; // 全局透明度
  gl_FragColor = filterColor(gl_FragColor);
}
