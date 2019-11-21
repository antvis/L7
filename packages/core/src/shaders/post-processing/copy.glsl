varying vec2 v_UV;

uniform sampler2D u_Texture;

void main() {
  gl_FragColor = vec4(texture2D(u_Texture, v_UV));
}