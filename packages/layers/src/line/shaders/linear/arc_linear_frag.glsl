#define Animate 0.0
#define LineTexture 1.0

uniform float u_opacity;
uniform float u_textureBlend;
uniform float u_blur : 0.9;
uniform float u_line_type: 0.0;
// varying vec2 v_normal;
varying vec4 v_dash_array;
varying vec4 v_color;

uniform float u_time;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];

uniform float u_line_texture;
uniform sampler2D u_texture;
uniform vec2 u_textSize;

uniform float segmentNumber;
varying vec2 v_iconMapUV;

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

#pragma include "picking"

void main() {
  float opacity = styleMappingMat[0][0];
  float d_segmentIndex = styleMappingMat[3].r;   // 当前顶点在弧线中所处的分段位置

  // 设置弧线的底色
  gl_FragColor = mix(u_sourceColor, u_targetColor, d_segmentIndex/segmentNumber);
  gl_FragColor.a *= opacity;
  gl_FragColor = filterColor(gl_FragColor);
}