
attribute vec3 a_Position;
uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
attribute float a_Size;
attribute vec4 a_Color;

varying vec4 v_color;

#pragma include "projection"
#pragma include "project"

void main() {
  v_color = a_Color;

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(a_Position.xy, a_Position.z, 1.0);
  } else {
    vec4 project_pos = project_position(vec4(a_Position, 1.0)) + vec4(a_Size / 2.,-a_Size /2.,0.,0.);
    gl_Position = project_common_position_to_clipspace(vec4(vec2(project_pos.xy),project_pos.z,project_pos.w));
  }

  gl_PointSize = a_Size * 2.0 * u_DevicePixelRatio;
}
