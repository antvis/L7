precision highp float;
attribute vec3 a_Position;
attribute vec2 a_Uv;
uniform sampler2D u_texture;
varying vec2 v_texCoord;
varying float v_intensity;
void main() {
  v_texCoord = a_Uv;
  v_intensity = texture2D(u_texture, v_texCoord).r;
  gl_Position = vec4(a_Position.xy, 0, 1.);
}
