precision highp float;

attribute vec3 a_Position;
attribute vec3 a_Color;

uniform mat4 u_ModelMatrix;
uniform float u_opacity;
uniform float u_Scale;
varying vec3 v_Color;
varying float v_d;

#pragma include "projection"
void main() {
   v_Color = a_Color;
  
   vec4 project_pos = project_position(vec4(a_Position, 1.0));

   v_d = a_Position.z;

  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xy, a_Position.z, 1.0));
gl_PointSize = pow((u_Zoom - 1.0), 2.0) * u_Scale;
}
