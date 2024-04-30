layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_uv;

layout(std140) uniform commonUniforms {
  vec4 u_watercolor;
  vec4 u_watercolor2;
  float u_time;
};

out vec2 v_uv;
out float v_opacity;

#pragma include "projection"

void main() {
  v_uv = a_uv;
  v_opacity = opacity;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
}

