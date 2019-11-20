precision highp float;
// 多边形顶点坐标
attribute vec3 a_Position;
// 多边形经纬度坐标
attribute vec3 a_Pos;
attribute float a_Size;
attribute vec4 a_Color;
uniform vec2 u_radius;
uniform float u_coverage: 0.9;
uniform float u_angle: 0;
uniform mat4 u_ModelMatrix;
varying vec4 v_color;

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

void main() {
  v_color = a_Color;

  mat2 rotationMatrix = mat2(cos(u_angle), sin(u_angle), -sin(u_angle), cos(u_angle));
  vec2 offset = a_Position.xy * u_radius * rotationMatrix * u_coverage ;
  // vec2 lnglat = unProjectFlat(a_Pos.xy);
  vec4 project_pos = project_position(vec4(a_Pos.xy + offset, 0, 1.0));
  gl_Position = project_common_position_to_clipspace(project_pos);

  setPickingColor(a_PickingColor);
}
