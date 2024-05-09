precision highp float;

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  float u_opacity;
};

out vec2 v_texCoord;

#pragma include "projection"

void main() {
  v_texCoord = a_Uv;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, 0.0, 1.0));
}
