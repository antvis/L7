precision mediump float;
uniform float u_opacity: 1.0;
uniform sampler2D u_texture;
varying vec2 v_texCoord;
void main() {
  vec4 color = texture2D(u_texture,vec2(v_texCoord.x,v_texCoord.y));
  gl_FragColor = color;
  gl_FragColor.a *= u_opacity;
}
