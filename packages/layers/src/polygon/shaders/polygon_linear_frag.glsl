#pragma include "picking"

layout(std140) uniform ModelUniforms {
  float u_raisingHeight;
  float u_opacitylinear;
  float u_dir;
};

in vec3 v_linear;
in vec2 v_pos;
in vec4 v_Color;

out vec4 outputColor;

void main() {
  outputColor = v_Color;
  if(u_opacitylinear > 0.0) {
    outputColor.a *= u_dir == 1.0 ? 1.0 - length(v_pos - v_linear.xy)/v_linear.z : length(v_pos - v_linear.xy)/v_linear.z;
  }
  outputColor = filterColor(outputColor);
}
