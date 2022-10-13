attribute float a_Miter;
attribute vec4 a_Color;
attribute vec3 a_Normal;
attribute vec3 a_Position;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform float u_size;

#pragma include "projection"

void main() {

  vec3 size = a_Miter * u_size * reverse_offset_normal(a_Normal);
  
  vec2 offset = project_pixel(size.xy);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * (vec4(project_pos.xy + offset, 0.0, 1.0));
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));
  }
}
