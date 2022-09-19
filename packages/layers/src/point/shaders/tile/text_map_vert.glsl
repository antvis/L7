#define FONT_SIZE 24.0
attribute vec3 a_Position;
attribute vec2 a_tex;
attribute vec2 a_textOffsets;

uniform vec2 u_sdf_map_size;
uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

uniform float u_size;

varying vec2 v_uv;
varying float v_gamma_scale;
varying float v_fontScale;

#pragma include "projection"

void main() {
  v_uv = a_tex / u_sdf_map_size;

  // 文本缩放比例
  float fontScale = u_size / FONT_SIZE;
  v_fontScale = fontScale;

  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  vec4 projected_position;
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
   projected_position  = u_Mvp * (vec4(a_Position.xyz, 1.0));
  } else { // else
   projected_position  = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
  }

  gl_Position = vec4(
    projected_position.xy / projected_position.w + a_textOffsets * fontScale / u_ViewportSize * 2.0 * u_DevicePixelRatio, 0.0, 1.0);
  v_gamma_scale = gl_Position.w;

}
