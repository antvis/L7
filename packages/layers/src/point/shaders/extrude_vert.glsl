precision highp float;
attribute vec3 a_Position;
attribute vec4 a_color;
attribute vec3 a_size;
attribute vec3 a_shape;
attribute vec3 a_normal;

uniform mat4 u_ModelMatrix;
varying vec4 v_color;

#pragma include "projection"
void main() {
 vec3 size = a_size * a_shape;
 v_color = vec4(a_normal,1.0);
 vec2 offset = project_pixel(size.xy);
 vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));
 gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, size.z, 1.0));

}