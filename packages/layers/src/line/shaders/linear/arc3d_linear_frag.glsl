
#define Animate 0.0
uniform float u_time;
uniform vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
varying vec4 v_Color;

varying float v_distance_ratio;
#pragma include "picking"

void main() {

  float animateSpeed = 0.0; // 运动速度
  gl_FragColor = v_Color;

  if(u_animate.x == Animate) {
      animateSpeed = u_time / u_animate.y;
      float alpha =1.0 - fract( mod(1.0- v_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + u_time / u_animate.y);

      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      // alpha = smoothstep(0., 1., alpha);
      alpha = clamp(alpha, 0.0, 1.0);
      gl_FragColor.a *= alpha;

      // u_animate 
      // x enable
      // y duration
      // z interval
      // w trailLength
  }

  gl_FragColor = filterColor(gl_FragColor);
}
