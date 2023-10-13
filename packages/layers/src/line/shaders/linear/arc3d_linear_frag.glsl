
#define Animate 0.0

layout(std140) uniform ModelUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec4 u_dash_array;
  vec2 u_textSize;
  float u_linearColor;
  float u_line_texture;
  float u_icon_step;
  float u_globel;
  float u_globel_radius;
  float u_global_height;
  float u_textureBlend;
  float u_line_type;
  float segmentNumber;
};

in vec4 v_Color;
in float v_distance_ratio;

out vec4 outputColor;

#pragma include "picking"
#pragma include "animation"

void main() {

  float animateSpeed = 0.0; // 运动速度
  outputColor = v_Color;

  if(u_animate.x == Animate) {
      animateSpeed = u_time / u_animate.y;
      float alpha =1.0 - fract( mod(1.0- v_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + u_time / u_animate.y);

      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      // alpha = smoothstep(0., 1., alpha);
      alpha = clamp(alpha, 0.0, 1.0);
      outputColor.a *= alpha;

      // u_animate 
      // x enable
      // y duration
      // z interval
      // w trailLength
  }

  outputColor = filterColor(outputColor);
}
