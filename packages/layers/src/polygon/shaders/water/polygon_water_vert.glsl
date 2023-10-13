layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 7) in vec2 a_uv;

layout(std140) uniform ModelUniforms {
  float u_speed;
  float u_opacity;
};

out vec4 v_Color;
out vec2 v_uv;

#pragma include "projection"
#pragma include "picking"
#pragma include "animation"

void main() {
  v_uv = a_uv;

  v_Color = a_Color;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xyz, 1.0));
}

