layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;

layout(std140) uniform u_Common {
  float u_size_scale;
};

out vec4 v_color;

#pragma include "projection"
#pragma include "project"

void main() {
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);

  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(project_pos);

  gl_PointSize = a_Size * u_size_scale * 2.0 * u_DevicePixelRatio;
}
