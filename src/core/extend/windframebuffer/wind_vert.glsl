precision highp float;
varying vec2 v_texCoord;
void main() {
   v_texCoord = uv;
   gl_Position =  vec4(1.0 - 2.0 * vec2(position), 0., 1.0);
}