precision highp float;
attribute vec3 a_Position;
attribute vec2 a_Uv;
uniform sampler2D u_texture;
varying vec2 v_texCoord;
void main() {
   v_texCoord = a_Uv;
   float intensity = texture2D(u_texture, v_texCoord).r;
   gl_Position = vec4(a_Position.xy,intensity -0.5, 1.);
}
