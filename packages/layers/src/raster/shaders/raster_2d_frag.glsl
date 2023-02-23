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
bool isnan_emu(float x) { return (x > 0.0 || x < 0.0) ? x != x : x != 0.0; }


void main() {

  float value = texture2D(u_texture,vec2(v_texCoord.x,v_texCoord.y)).r;
  if (value == u_noDataValue || isnan_emu(value))
      discard;
  else if ((!u_clampLow && value < u_domain[0]) || (!u_clampHigh && value > u_domain[1]))
     discard;
  else {
    float normalisedValue =(value - u_domain[0]) / (u_domain[1] -u_domain[0]);
    vec4 color = texture2D(u_colorTexture,vec2(normalisedValue, 0));
    
    gl_FragColor = color;
    gl_FragColor.a =  gl_FragColor.a * u_opacity ;
    if(gl_FragColor.a < 0.01)
      discard;
   
  }
}
