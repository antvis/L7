uniform sampler2D u_texture;
uniform float u_opacity: 1.0;
// varying vec4 v_Color;
varying mat4 styleMappingMat; // 传递从片元中传递的映射数据
#pragma include "picking"

void main() {
  float opacity = styleMappingMat[0][0];
  float isSide = styleMappingMat[0][3];
  
  float topU = styleMappingMat[2][2];
  float topV = styleMappingMat[2][3];

  float sidey = styleMappingMat[3][0];
  if(isSide < 1.0) {
    gl_FragColor = vec4(0.0, sidey, 0.0, 1.0);
  } else {
    gl_FragColor = texture2D(u_texture, vec2(topU, topV));
  }

  // gl_FragColor = v_Color;
  

  gl_FragColor.a *= opacity;
  gl_FragColor = filterColor(gl_FragColor);
}
