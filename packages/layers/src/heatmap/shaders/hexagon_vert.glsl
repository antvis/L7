precision highp float;
attribute vec3 a_Position;
attribute vec3 a_miter;
attribute float a_size;
attribute vec4 a_color;
uniform vec2 u_radius;
uniform float u_coverage: 1.;
uniform float u_angle: 0;
uniform mat4 u_ModelMatrix;
varying vec4 v_color;
#pragma include "projection"
void main() {
    v_color = a_color;
    mat2 rotationMatrix = mat2(cos(u_angle), sin(u_angle), -sin(u_angle), cos(u_angle));
    vec2 offset =(vec2(a_miter.xy * u_radius * u_coverage * rotationMatrix));
    vec4 project_pos = project_position(vec4(a_Position.xy + offset, 0, 1.0));
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, 0., 1.0));
}