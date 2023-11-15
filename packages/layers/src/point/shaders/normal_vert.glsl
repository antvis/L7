layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 9) in float a_Size;

layout(std140) uniform u_Common {
  float u_size_scale;
};

out vec4 v_color;

#pragma include "projection"
#pragma include "project"

void main() {
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);

  if (u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(a_Position, 1.0);
  } else {
    vec4 project_pos = project_position(vec4(a_Position, 1.0)) + vec4(a_Size / 2., -a_Size /2., 0., 0.);
    gl_Position = project_common_position_to_clipspace(project_pos);
  }

  gl_PointSize = a_Size * u_size_scale *  2.0  * u_DevicePixelRatio;
}
