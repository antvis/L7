attribute vec3 a_Position;
attribute vec3 a_Extrude;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

#pragma include "projection"

void main() {
  vec2 offset = a_Extrude.xy * 10.0;
  
  offset = project_pixel(offset);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));
 

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(project_pos.xy + offset, 0.0, 1.0);
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));
  }
}
