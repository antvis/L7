precision mediump float;
uniform float u_opacity: 1.0;
uniform sampler2D u_texture;
uniform float u_channelRMax: 256.;
uniform float u_channelGMax: 256.;
uniform float u_channelBMax: 256.;
varying vec2 v_texCoord;

void main() {
  vec3 rgb = texture2D(u_texture,vec2(v_texCoord.x,v_texCoord.y)).rgb;
  gl_FragColor = vec4(rgb.r/u_channelRMax, rgb.g/u_channelGMax, rgb.b/u_channelBMax, u_opacity);
}