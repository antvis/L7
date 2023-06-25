uniform float u_opacity: 1.0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;
uniform float u_linearColor: 0;

uniform float u_topsurface: 1.0;
uniform float u_sidesurface: 1.0;

varying vec4 v_Color;
varying vec3 v_uvs;
varying vec2 v_texture_data;

#pragma include "picking"

void main() {
  float opacity = u_opacity;
  float isSide =  v_texture_data.x;
  float sidey = v_uvs[2];
  float lightWeight = v_texture_data.y;

  // Tip: 部分机型 GPU 计算精度兼容
  if(isSide < 0.999) {
    // side face
    if(u_sidesurface < 1.0) {
      discard;
    }
    
    if( u_linearColor == 1.0) {
      // side use linear
      vec4 linearColor = mix(u_targetColor, u_sourceColor, sidey);
      linearColor.rgb *= lightWeight;
      gl_FragColor = linearColor;
    } else {
      // side notuse linear
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
  gl_FragColor = filterColorAlpha(gl_FragColor, lightWeight);
}
