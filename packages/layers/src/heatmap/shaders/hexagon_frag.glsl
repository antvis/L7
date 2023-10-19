layout(std140) uniform ModelUniforms {
  vec2 u_radius;
  float u_opacity;
  float u_coverage;
  float u_angle;
};

in vec4 v_color;
out vec4 outputColor;

#pragma include "picking"

void main() {
  outputColor = v_color;
  outputColor.a *= u_opacity;

  outputColor = filterColor(outputColor);
}
