
in vec4 v_color;
in float v_lightWeight;
out vec4 outputColor;

layout(std140) uniform commonUniforms {
  float u_pickLight;
  float u_heightfixed;
  float u_r;
  float u_linearColor;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_opacitylinear;
  float u_opacitylinear_dir;
  float u_lightEnable;
};

#pragma include "scene_uniforms"
#pragma include "picking"

void main() {

  outputColor = v_color;
  // 开启透明度渐变
  // picking
  if(u_pickLight > 0.0) {
    outputColor = filterColorAlpha(outputColor, v_lightWeight);
  } else {
    outputColor = filterColor(outputColor);
  }
}
