precision highp float;
attribute vec3 a_Position;
attribute vec2 a_Uv;
varying vec2 v_texCoord;

void main() {
  v_texCoord = a_Uv;

  gl_Position = vec4(a_Position.xy, 0, 1.);
}
