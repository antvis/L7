layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_DIR) in vec2 a_Dir;

layout(std140) uniform commonUniforms {
  float u_radius;
  float u_intensity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
};

out vec2 v_extrude;
out float v_weight;

#define GAUSS_COEF (0.3989422804014327)

#pragma include "projection"
#pragma include "picking"

void main() {
  vec3 picking_color_placeholder = u_PickingColor;

  v_weight = a_Size;
  float ZERO = 1.0 / 255.0 / 16.0;
  float extrude_x = a_Dir.x * 2.0 - 1.0;
  float extrude_y = a_Dir.y * 2.0 - 1.0;
  vec2 extrude_dir = normalize(vec2(extrude_x, extrude_y));
  float S = sqrt(-2.0 * log(ZERO / a_Size / u_intensity / GAUSS_COEF)) / 2.5;
  v_extrude = extrude_dir * S;

  vec2 offset = project_pixel(v_extrude * u_radius);
  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

}
