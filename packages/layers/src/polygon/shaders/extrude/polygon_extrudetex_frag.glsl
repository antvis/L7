uniform sampler2D u_texture;
uniform float u_opacity: 1.0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;
// varying vec4 v_Color;
varying mat4 styleMappingMat; // 传递从片元中传递的映射数据
#pragma include "picking"

void main() {
  float opacity = styleMappingMat[0][0];
  float isSide = styleMappingMat[0][3];
  float lightWeight = styleMappingMat[3][1];
  float topU = styleMappingMat[2][2];
  float topV = styleMappingMat[2][3];

  float sidey = styleMappingMat[3][0];
  if(isSide < 1.0) {
    gl_FragColor = mix(u_targetColor, u_sourceColor, sidey);
    gl_FragColor.rgb *= lightWeight;
  } else {
    gl_FragColor = texture2D(u_texture, vec2(topU, topV));
  }
  

  gl_FragColor.a *= opacity;
  gl_FragColor = filterColor(gl_FragColor);
}
