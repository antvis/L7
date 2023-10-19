in vec4 v_color;

out vec4 outputColor;

layout(std140) uniform ModelUniforms {
  float u_raisingHeight;
  float u_opacitylinear;
  float u_dir;
};

#pragma include "picking"

void main() {
  outputColor = v_color;
  outputColor = filterColor(outputColor);
}
