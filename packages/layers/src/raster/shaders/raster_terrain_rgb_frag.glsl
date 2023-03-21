precision mediump float;
uniform float u_opacity: 1.0;

uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;

varying vec2 v_texCoord;

uniform vec2 u_domain;
uniform float u_noDataValue;
uniform bool u_clampLow: true;
uniform bool u_clampHigh: true;
uniform vec4 u_unpack;

float getElevation(vec2 coord, float bias) {
    // Convert encoded elevation value to meters
    vec4 data = texture2D(u_texture, coord,bias) * 255.0;
    data.a = -1.0;
    return dot(data, u_unpack);
}

vec4 getColor(float value) {
   float normalisedValue =(value- u_domain[0]) / (u_domain[1] - u_domain[0]);
    vec2 coord = vec2(normalisedValue, 0);
    return texture2D(u_colorTexture, coord);
}

void main() {
  float value = getElevation(v_texCoord,0.0);
  if (value == u_noDataValue) {
    gl_FragColor = vec4(0.0, 0, 0, 0.0);
  } else if ((!u_clampLow && value < u_domain[0]) || (!u_clampHigh && value > u_domain[1])) {
     gl_FragColor = vec4(0.0, 0, 0, 0.0);
  } else {
   
    gl_FragColor = getColor(value);
    gl_FragColor.a =  gl_FragColor.a * u_opacity ;
      if(gl_FragColor.a < 0.01)
      discard;
  }
}
