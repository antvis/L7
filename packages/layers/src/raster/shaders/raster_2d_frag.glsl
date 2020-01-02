precision mediump float;
uniform float u_opacity: 1.0;
uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;
uniform float u_min;
uniform float u_max;
uniform vec2 u_domain;
uniform float u_noDataValue;
uniform bool u_clampLow: true;
uniform bool u_clampHigh: true;
varying vec2 v_texCoord;

void main() {

  float value = texture2D(u_texture,vec2(v_texCoord.x,v_texCoord.y)).r;
  if (value == u_noDataValue)
    gl_FragColor = vec4(0.0, 0, 0, 0.0);
  else if ((!u_clampLow && value < u_domain[0]) || (!u_clampHigh && value > u_domain[1]))
    gl_FragColor = vec4(0, 0, 0, 0);
  else {
    float normalisedValue =(value - u_domain[0]) / (u_domain[1] -u_domain[0]);
    vec2 ramp_pos = vec2(
        fract(16.0 * (1.0 - normalisedValue)),
        floor(16.0 * (1.0 - normalisedValue)) / 16.0);
    gl_FragColor = texture2D(u_colorTexture, ramp_pos);
  }


}
