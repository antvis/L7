layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;

layout(std140) uniform commonUniorm {
  vec4 u_color;
  float u_opacity;
};

#pragma include "projection"

void main() {
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
}

