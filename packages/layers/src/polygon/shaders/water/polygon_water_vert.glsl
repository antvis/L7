layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_uv;

layout(std140) uniform commonUniforms {
  float u_speed;
  float u_time;
};
out vec4 v_Color;
out vec2 v_uv;

#pragma include "projection"

void main() {
  v_uv = a_uv;
  v_Color = a_Color;
  v_Color.a *= opacity;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
}

