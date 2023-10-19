uniform sampler2D u_texture;

layout(std140) uniform ModelUniforms {
  vec2 u_textSize;
  float u_raisingHeight;
  float u_heightfixed;
  float u_size_unit;
};

#pragma include "picking"

in vec2 v_uv; // 本身的 uv 坐标
in vec2 v_Iconuv;
in float v_opacity;

out vec4 outputColor;

void main() {

  vec2 pos = v_Iconuv / u_textSize + v_uv / u_textSize * 64.;
  outputColor = texture(SAMPLER_2D(u_texture), pos);
  outputColor.a *= v_opacity;

  outputColor = filterColor(outputColor);
}
