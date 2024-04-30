
layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;

layout(std140) uniform commonUniorm {
  vec4 u_stroke_color;
  float u_additive;
  float u_stroke_opacity;
  float u_stroke_width;
};

out vec4 v_color;
out float v_blur;
out float v_innerRadius;

#pragma include "projection"
#pragma include "picking"
#pragma include "project"
void main() {
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);
  v_blur = 1.0 - max(2.0 / a_Size, 0.05);
  v_innerRadius = max((a_Size - u_stroke_width) / a_Size, 0.0);

  vec2 offset = project_pixel(u_offsets);

  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(vec4(vec2(project_pos.xy+offset),project_pos.z,project_pos.w));

  gl_PointSize = a_Size * 2.0 * u_DevicePixelRatio;
  setPickingColor(a_PickingColor);
}
