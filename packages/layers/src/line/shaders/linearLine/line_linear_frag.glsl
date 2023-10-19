in float v_linearRadio;
out vec4 outputColor;

uniform sampler2D u_texture;

layout(std140) uniform ModelUniforms {
  float u_linearDir;
  float u_opacity;
  float u_vertexScale;
  float u_heightfixed;
  float u_raisingHeight;
};

#pragma include "picking"
void main() { 
  outputColor = texture(SAMPLER_2D(u_texture), vec2(v_linearRadio, 0.5));
  outputColor.a *= u_opacity;
  outputColor = filterColor(outputColor);
}
