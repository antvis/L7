in vec4 v_Color;
out vec4 outputColor;

#pragma include "picking"

layout(std140) uniform ModelUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed;
  float u_raisingHeight;
};

void main() {
  // top face
  if (u_topsurface < 1.0) {
    discard;
  }

  outputColor = v_Color;

  outputColor = filterColor(outputColor);
}
