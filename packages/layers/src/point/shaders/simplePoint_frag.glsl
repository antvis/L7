
uniform float u_additive;
uniform float u_stroke_opacity : 1;

uniform vec4 u_stroke_color : [0.0, 0.0, 0.0, 0.0];

varying vec4 v_color;
varying float v_blur;
varying float v_innerRadius;

#pragma include "picking"
void main() {
  vec2 center = vec2(0.5);

  // Tip: 片元到中心点的距离 0 - 1
  float fragmengTocenter = distance(center, gl_PointCoord) * 2.0;
  // Tip: 片元的剪切成圆形
  float circleClipOpacity = 1.0 - smoothstep(v_blur, 1.0, fragmengTocenter);


  if(v_innerRadius < 0.99) {
    // 当存在 stroke 且 stroke > 0.01
    float blurWidth = (1.0 - v_blur)/2.0;
    vec4 stroke = vec4(u_stroke_color.rgb, u_stroke_opacity);
    if(fragmengTocenter > v_innerRadius + blurWidth) {
      gl_FragColor = stroke;
    } else if(fragmengTocenter > v_innerRadius - blurWidth){
      float mixR = (fragmengTocenter - (v_innerRadius - blurWidth)) / (blurWidth * 2.0);
      gl_FragColor = mix(v_color, stroke, mixR);
    } else {
      gl_FragColor = v_color;
    }
  } else {
    // 当不存在 stroke 或 stroke <= 0.01
    gl_FragColor = v_color;
  }

  gl_FragColor = filterColor(gl_FragColor);
  
  if(u_additive > 0.0) {
    gl_FragColor *= circleClipOpacity;
  } else {
    gl_FragColor.a *= circleClipOpacity;
  }

}
