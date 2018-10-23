precision mediump float;
uniform sampler2D u_texture;
uniform float u_opacity;
varying vec2 v_texCoord;

void main() {
  if(u_opacity == 0.0)
    discard;
  gl_FragColor = texture2D(u_texture,1.0 - v_texCoord) * u_opacity;

}