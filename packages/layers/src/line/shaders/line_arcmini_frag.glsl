#define LineTypeSolid 0.0
#define Animate 0.0

uniform float u_opacity;
uniform float u_blur : 0.9;
// varying vec2 v_normal;
varying vec4 v_color;

uniform float u_time;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];

uniform float segmentNumber;
varying float v_distance_ratio;

uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

#pragma include "picking"

void main() {

  // 设置弧线的底色
  if(u_linearColor == 1.0) { // 使用渐变颜色
    gl_FragColor = mix(u_sourceColor, u_targetColor, v_distance_ratio);
  } else { // 使用 color 方法传入的颜色
     gl_FragColor = v_color;
  }
  
 
  gl_FragColor.a *= u_opacity;

  if(u_aimate.x == Animate) {
      float animateSpeed = u_time / u_aimate.y; // 运动速度
      float alpha =1.0 - fract( mod(1.0- v_distance_ratio, u_aimate.z)* (1.0/ u_aimate.z) + u_time / u_aimate.y);
      alpha = (alpha + u_aimate.w -1.0) / u_aimate.w;
      // alpha = smoothstep(0., 1., alpha);
      alpha = clamp(alpha, 0.0, 1.0);
      gl_FragColor.a *= alpha;
  }
}