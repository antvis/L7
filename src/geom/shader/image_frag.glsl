precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_texCoord;
void main() {
  
  gl_FragColor = texture2D(u_texture,vec2(v_texCoord.x,1.0-v_texCoord.y));
  // gl_FragColor = vec4(1.0);

}