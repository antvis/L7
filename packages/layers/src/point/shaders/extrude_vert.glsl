precision highp float;

#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec3 a_Position;
attribute vec3 a_Pos;
attribute vec4 a_Color;
attribute vec3 a_Size;
attribute vec3 a_Normal;

uniform mat4 u_ModelMatrix;
uniform vec2 u_offsets;
varying vec4 v_color;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
  vec3 size = a_Size * a_Position;

  vec2 offset = project_pixel(size.xy);

  vec4 project_pos = project_position(vec4(a_Pos.xy, 0., 1.0));

  vec4 pos = vec4(project_pos.xy + offset, project_pixel(size.z), 1.0);

  float lightWeight = calc_lighting(pos);
  v_color =vec4(a_Color.rgb * lightWeight, a_Color.w);

  gl_Position = project_common_position_to_clipspace(pos);
  setPickingColor(a_PickingColor);
}
