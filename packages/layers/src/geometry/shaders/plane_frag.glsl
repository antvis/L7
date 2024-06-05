uniform sampler2D u_texture;
layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_mapFlag;
  float u_terrainClipHeight;
};

in vec3 v_Color;
in vec2 v_uv;
in float v_clip;
out vec4 outputColor;

#pragma include "picking"
void main() {
  if (u_mapFlag > 0.0) {
    outputColor = texture(SAMPLER_2D(u_texture), vec2(v_uv.x, 1.0 - v_uv.y));
    outputColor.a *= u_opacity;
  } else {
    outputColor = vec4(v_Color, u_opacity);
  }
  outputColor.a *= v_clip;
  outputColor = filterColor(outputColor);
}
