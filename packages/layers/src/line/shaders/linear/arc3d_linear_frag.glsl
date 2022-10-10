
#define Animate 0.0

uniform float u_opacity;
uniform float u_blur : 0.9;
varying float v_segmentIndex;
uniform float segmentNumber;

uniform float u_time;
uniform vec4 u_animate: [ 1., 2., 1.0, 0.2 ];

uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

varying mat4 styleMappingMat;

#pragma include "picking"

void main() {
  float opacity = styleMappingMat[0][0];
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = styleMappingMat[3].g; // 当前点位距离占线总长的比例

  gl_FragColor = mix(u_sourceColor, u_targetColor, v_segmentIndex/segmentNumber);

  gl_FragColor.a *= opacity;

  if(u_animate.x == Animate) {
      animateSpeed = u_time / u_animate.y;
      float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + u_time / u_animate.y);

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
