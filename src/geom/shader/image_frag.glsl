precision mediump float;
uniform sampler2D u_texture;
uniform float u_opacity;
varying vec2 v_texCoord;
void main() {
  vec4 color = texture2D(u_texture,vec2(v_texCoord.x,1.0-v_texCoord.y));
  gl_FragColor = color * u_opacity;
}