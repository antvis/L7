layout(location = 0) in vec3 a_Position;
layout(location = 7) in vec2 a_uv;

layout(std140) uniform ModelUniforms {
  vec4 u_watercolor;
  vec4 u_watercolor2;
  float u_opacity;
};

out vec2 v_uv;

#pragma include "projection"
#pragma include "picking"
#pragma include "animation"

void main() {
  v_uv = a_uv;

  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xyz, 1.0));
}

