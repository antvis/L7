layout(std140) uniform commonUniforms {
 mat2 u_RotateMatrix;
 vec2 u_size;
 float u_raisingHeight;
 float u_opacity;
};
uniform sampler2D u_texture;

in vec2 v_uv;
out vec4 outputColor;

#pragma include "picking"
void main() {
  outputColor = texture(SAMPLER_2D(u_texture), vec2(v_uv.x, 1.0 - v_uv.y));
  outputColor.a *= u_opacity;
  outputColor = filterColor(outputColor);
}
