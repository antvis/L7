#define SDF_PX 8.0
#define EDGE_GAMMA 0.105
#define FONT_SIZE 24.0
attribute vec3 a_Position;
attribute vec2 a_tex;
attribute vec2 a_textOffsets;
attribute vec4 a_Color;
attribute float a_Size;
attribute float a_Rotate;

uniform vec2 u_sdf_map_size;
uniform mat4 u_ModelMatrix;

varying vec2 v_uv;
varying float v_gamma_scale;
varying vec4 v_color;
varying float v_fontScale;

#pragma include "projection"
#pragma include "picking"

void main() {
  v_color = a_Color;
  v_uv = a_tex / u_sdf_map_size;

  // 文本缩放比例
  float fontScale = a_Size / FONT_SIZE;
   v_fontScale = fontScale;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  vec4 projected_position  = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
 highp float angle_sin = sin(a_Rotate);
 highp float angle_cos = cos(a_Rotate);
 mat2 rotation_matrix = mat2(angle_cos, -1.0 * angle_sin, angle_sin, angle_cos);
  gl_Position = vec4(projected_position.xy / projected_position.w
    + rotation_matrix * a_textOffsets * fontScale / u_ViewportSize * 2.0 * u_DevicePixelRatio, 0.0, 1.0);
  v_gamma_scale = gl_Position.w;
  setPickingColor(a_PickingColor);

}
