precision highp float;
attribute vec3 a_Position;
uniform mat4 u_ModelMatrix;
uniform vec4 u_extent;
uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;
uniform float u_min;
uniform float u_max;
uniform float u_width;
uniform float u_height;
uniform float u_heightRatio;

varying vec2 v_texCoord;
varying vec4 v_color;

#pragma include "projection"
void main() {
  vec2 uv = a_Position.xy / vec2(u_width, u_height);
  vec2 minxy =  project_position(vec4(u_extent.xy, 0, 1.0)).xy;
  vec2 maxxy =  project_position(vec4(u_extent.zw, 0, 1.0)).xy;
  float value = texture2D(u_texture, vec2(uv.x,1.0 - uv.y)).x;
  vec2 step = (maxxy - minxy) / vec2(u_width, u_height);
  vec2 pos = minxy + vec2(a_Position.x, a_Position.y ) * step;
  //  v_texCoord = a_Uv;
  value = clamp(value,u_min,u_max);
  float value1 =  (value - u_min) / (u_max -u_min);
  vec2 ramp_pos = vec2(
        fract(16.0 * (1.0 - value1)),
        floor(16.0 * (1.0 - value1)) / 16.0);
  v_color = texture2D(u_colorTexture,ramp_pos);

  // if(uv.x > 1.0 || uv.y > 1.0) {
  //   v_color = vec4(0.);
  // }

  //  vec2 range = u_extent.zw - u_extent.xy;
  //  vec4 project_pos = project_position(vec4(pos, 0, 1.0));
   gl_Position = project_common_position_to_clipspace(vec4(pos.xy, project_scale(value) * u_heightRatio, 1.0));

}
