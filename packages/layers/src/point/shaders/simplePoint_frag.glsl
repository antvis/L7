
uniform float u_opacity : 1;
uniform vec2 u_offsets;
varying vec4 v_color;
varying mat4 styleMappingMat; // 传递从片元中传递的映射数据
varying float v_blur;
#pragma include "picking"
void main() {
  vec2 center = vec2(0.5);

  float opacity = styleMappingMat[0][0];

  
  gl_FragColor = v_color;

  gl_FragColor.a =gl_FragColor.a * opacity;
  gl_FragColor = filterColor(gl_FragColor);

  float fragmengTocenter = distance(center, gl_PointCoord) * 2.0;

  float circleClipOpacity = 1.0 - smoothstep(v_blur, 1.0, fragmengTocenter);
  gl_FragColor = vec4(1.0, 0.0, 0.0, circleClipOpacity);
}
