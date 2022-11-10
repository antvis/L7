uniform float u_opacity: 1.0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;
uniform float u_linearColor: 0;

uniform float u_topsurface: 1.0;
uniform float u_sidesurface: 1.0;

varying vec4 v_Color;
varying mat4 styleMappingMat; // 传递从片元中传递的映射数据
#pragma include "picking"

void main() {
  float opacity = styleMappingMat[0][0];  
  float isSide = styleMappingMat[0][3];
  float sidey = styleMappingMat[3][0];
  float lightWeight = styleMappingMat[3][1];

  // Tip: 部分机型 GPU 计算精度兼容
  if(isSide < 0.999) {
    // side face
    if(u_sidesurface < 1.0) {
      discard;
    }

    if(u_linearColor == 1.0) {
      vec4 linearColor = mix(u_targetColor, u_sourceColor, sidey);
      linearColor.rgb *= lightWeight;
      gl_FragColor = linearColor;
    } else {
      gl_FragColor = v_Color;
    }

  } else {
     // top face
    if(u_topsurface < 1.0) {
      discard;
    }

    gl_FragColor = v_Color;
  }

  gl_FragColor.a *= opacity;
  gl_FragColor = filterColor(gl_FragColor);
}
