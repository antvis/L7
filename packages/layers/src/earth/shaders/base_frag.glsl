uniform sampler2D u_texture;

layout(std140) uniform ModelUniforms {
  vec3 u_sunLight;
  float u_ambientRatio;
  float u_diffuseRatio;
  float u_specularRatio;
};

in vec2 v_texCoord;
in float v_lightWeight;

#pragma include "picking"

out vec4 outputColor;

void main() {
  vec4 color = texture(SAMPLER_2D(u_texture),vec2(v_texCoord.x,v_texCoord.y));
  color.xyz = color.xyz * v_lightWeight;
  outputColor = color;
}
