layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec3 a_Extrude;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniform {
  vec2 u_textSize;
  float u_heightfixed;
  float u_raisingHeight;
  float u_size_unit;
};

out vec2 v_uv;
out vec2 v_Iconuv;
out float v_opacity;

#pragma include "projection"
#pragma include "picking"
#pragma include "rotation_2d"

void main() {
  vec3 extrude = a_Extrude;
  v_uv = (a_Extrude.xy + 1.0) / 2.0;
  v_uv.y = 1.0 - v_uv.y;
  v_Iconuv = a_Uv;
  v_opacity = opacity;
  float newSize = a_Size;
  if (u_size_unit == 1.0) {
    newSize = newSize * u_PixelsPerMeter.z;
  }

  // vec2 offset = (u_RotateMatrix * extrude.xy * (a_Size) + textrueOffsets);
  vec2 offset = extrude.xy * newSize + offsets;

  offset = rotate_matrix(offset, rotation);

  offset = project_pixel(offset);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

  setPickingColor(a_PickingColor);
}
