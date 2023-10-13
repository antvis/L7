in vec4 v_color;
in float v_lightWeight;

layout(std140) uniform ModelUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_heightfixed;
  float u_r;
  float u_opacity;
  float u_lightEnable;
  float u_opacitylinear;
  float u_opacitylinear_dir;
  float u_linearColor;
  float u_pickLight;
};

#pragma include "picking"

out vec4 outputColor;

void main() {
  outputColor = v_color;
  // 开启透明度渐变
  // picking
  if (u_pickLight > 0.0) {
    outputColor = filterColorAlpha(outputColor, v_lightWeight);
  } else {
    outputColor = filterColor(outputColor);
  }
}
