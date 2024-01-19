uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;

layout(std140) uniform commonUniforms {
 vec4 u_unpack;
 vec2 u_domain;
 float u_opacity;
 float u_noDataValue;
 float u_clampLow;
 float u_clampHigh;
};

in vec2 v_texCoord;
out vec4 outputColor;


float getElevation(vec2 coord, float bias) {
    // Convert encoded elevation value to meters
    vec4 data =  texture(SAMPLER_2D(u_texture), coord,bias) * 255.0;
    data.a = -1.0;
    return dot(data, u_unpack);
}

vec4 getColor(float value) {
   float normalisedValue =(value- u_domain[0]) / (u_domain[1] - u_domain[0]);
    vec2 coord = vec2(normalisedValue, 0);
    return  texture(SAMPLER_2D(u_colorTexture), coord);
}

void main() {
  float value = getElevation(v_texCoord,0.0);
  if (value == u_noDataValue) {
    outputColor = vec4(0.0, 0, 0, 0.0);
  } else if ((u_clampLow < 0.5 && value < u_domain[0]) || (u_clampHigh < 0.5 && value > u_domain[1])) {
     outputColor = vec4(0.0, 0, 0, 0.0);
  } else {
   
    outputColor = getColor(value);
    outputColor.a =  outputColor.a * u_opacity ;
      if(outputColor.a < 0.01)
      discard;
  }
}
