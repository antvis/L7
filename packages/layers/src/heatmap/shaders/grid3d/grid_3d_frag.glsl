in vec4 v_color;

layout(std140) uniform commonUniforms {
  vec2 u_radius;
  float u_opacity;
  float u_coverage;
  float u_angle;
};

#pragma include "scene_uniforms"
#pragma include "picking"

out vec4 outputColor;
void main() {
  outputColor = v_color;
  outputColor = filterColor(outputColor);
}
