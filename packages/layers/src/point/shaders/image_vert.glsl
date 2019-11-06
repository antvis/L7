
precision highp float;
attribute vec3 a_Position;
attribute vec4 a_Color;
attribute vec2 a_Uv;
attribute float a_Size;
varying vec4 v_color;
varying vec2 v_uv;
uniform mat4 u_ModelMatrix;
uniform float u_stroke_width : 1;
varying float v_size;

#pragma include "projection"
void main() {
   v_color = a_Color;
   v_uv = a_Uv;
   vec4 project_pos = project_position(vec4(a_Position, 1.0));
   v_size = a_Size;

   gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
   gl_PointSize = a_Size + u_stroke_width;

}
