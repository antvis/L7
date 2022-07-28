precision mediump float;
uniform float u_opacity: 1.0;

uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;

varying vec2 v_texCoord;

uniform vec2 u_domain;
uniform float u_noDataValue;
uniform bool u_clampLow: true;
uniform bool u_clampHigh: true;

uniform float u_pixelConstant;
uniform float u_pixelConstantR;
uniform float u_pixelConstantG;
uniform float u_pixelConstantB;
uniform float u_pixelConstantRGB;

void main() {
  vec4 color = texture2D(u_texture,vec2(v_texCoord.x,v_texCoord.y));

  float r = color.r;
  float g = color.g;
  float b = color.b;

  float value = u_pixelConstant + ((r * u_pixelConstantR + g * u_pixelConstantG + b * u_pixelConstantB) * u_pixelConstantRGB);

  if (value == u_noDataValue) {
    gl_FragColor = vec4(0.0, 0, 0, 0.0);
  } else if ((!u_clampLow && value < u_domain[0]) || (!u_clampHigh && value > u_domain[1])) {
    gl_FragColor = vec4(0, 0, 0, 0);
  } else {
    float normalisedValue =(value - u_domain[0]) / (u_domain[1] -u_domain[0]);
    vec4 color = texture2D(u_colorTexture,vec2(normalisedValue, 0));
    gl_FragColor = color;
    gl_FragColor.a =  gl_FragColor.a * u_opacity ;
  }
}
