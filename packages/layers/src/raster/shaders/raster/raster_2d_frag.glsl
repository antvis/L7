layout(std140) uniform commonUniforms {
  vec2 u_domain;
  float u_opacity;
  float u_noDataValue;
  float u_clampLow;
  float u_clampHigh;
};

uniform sampler2D u_rasterTexture;
uniform sampler2D u_colorTexture;

in vec2 v_texCoord;

bool isnan_emu(float x) { return (x > 0.0 || x < 0.0) ? x != x : x != 0.0; }

out vec4 outputColor;

void main() {
  // Can use any component here since u_rasterTexture is under luminance format.
  float value = texture(SAMPLER_2D(u_rasterTexture), vec2(v_texCoord.x, v_texCoord.y)).r;
  if (value == u_noDataValue || isnan_emu(value)) {
    discard;
  } else if ((u_clampLow < 0.5 && value < u_domain[0]) || (u_clampHigh < 0.5 && value > u_domain[1])) {
    discard;
  } else {
    float normalisedValue =(value - u_domain[0]) / (u_domain[1] - u_domain[0]);
    vec4 color = texture(SAMPLER_2D(u_colorTexture), vec2(normalisedValue, 0));
    
    outputColor = color;
    outputColor.a = outputColor.a * u_opacity ;
    if (outputColor.a < 0.01)
      discard;
  }
}
