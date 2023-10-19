uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;

layout(std140) uniform ModelUniforms {
  vec2 u_domain;
  float u_opacity;
  float u_clampLow;
  float u_clampHigh;
  float u_noDataValue;
};

in vec2 v_texCoord;
out vec4 outputColor;

#pragma include "picking"

bool isnan_emu(float x) { return (x > 0.0 || x < 0.0) ? x != x : x != 0.0; }

void main() {
  float value = texture(SAMPLER_2D(u_texture),vec2(v_texCoord.x,v_texCoord.y)).r;
  if (value == u_noDataValue || isnan_emu(value))
    discard;
  else if ((!(u_clampLow > 0.5) && value < u_domain[0]) || (!(u_clampHigh > 0.5) && value > u_domain[1]))
    discard;
  else {
    float normalisedValue =(value - u_domain[0]) / (u_domain[1] -u_domain[0]);
    vec4 color = texture(SAMPLER_2D(u_colorTexture),vec2(normalisedValue, 0));
    
    outputColor = color;
    outputColor.a = outputColor.a * u_opacity;
    if (outputColor.a < 0.01)
      discard;
  }
}
