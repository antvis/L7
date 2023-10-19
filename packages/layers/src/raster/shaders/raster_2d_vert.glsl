layout(location = 0) in vec3 a_Position;
layout(location = 7) in vec2 a_Uv;

layout(std140) uniform ModelUniforms {
  vec2 u_domain;
  float u_opacity;
  float u_clampLow;
  float u_clampHigh;
  float u_noDataValue;
};

out vec2 v_texCoord;

#pragma include "projection"
#pragma include "picking"

void main() {
  v_texCoord = a_Uv;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * (vec4(project_pos.xy,0., 1.0));
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy,0., 1.0));
  }
}
