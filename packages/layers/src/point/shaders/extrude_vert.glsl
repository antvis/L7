precision highp float;
attribute vec3 a_Position;
attribute vec3 a_Pos;
attribute vec4 a_Color;
attribute vec3 a_Size;
attribute vec3 a_Normal;

uniform mat4 u_ModelMatrix;
varying vec4 v_color;

#pragma include "projection"
void main() {
 vec3 size = a_Size * a_Position;
 v_color = vec4(a_Normal,1.0);
 vec2 offset = project_pixel(size.xy);
 vec4 project_pos = project_position(vec4(a_Pos.xy, 0, 1.0));
 gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, size.z, 1.0));

}
