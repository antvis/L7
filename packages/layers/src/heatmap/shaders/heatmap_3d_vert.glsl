precision highp float;
attribute vec3 a_Position;
attribute vec2 a_Uv;
uniform sampler2D u_texture;
uniform vec4 u_extent;
varying vec2 v_texCoord;
uniform mat4 u_ModelMatrix;
#pragma include "projection"
void main() {
   v_texCoord = a_Uv;
  vec2 minxy =  project_position(vec4(u_extent.xy, 0, 1.0)).xy;
  vec2 maxxy =  project_position(vec4(u_extent.zw, 0, 1.0)).xy;

  vec2 step = (maxxy - minxy);

  vec2 pos = minxy + (vec2(a_Position.x, a_Position.y ) + vec2(1.0)) / vec2(2.0)  * step;

  float intensity = texture2D(u_texture, v_texCoord).r;
  gl_Position = project_common_position_to_clipspace(vec4(pos.xy, 0, 1.0));
  v_texCoord =  (gl_Position.xy + vec2(1.0)) / vec2(2.0) * gl_Position.w;
  // v_texCoord.y = 1.0 - v_texCoord.y;

}
