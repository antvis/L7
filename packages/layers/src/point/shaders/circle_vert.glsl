attribute vec4 a_packed_data;
attribute vec2 a_Position;

uniform mat4 u_ModelMatrix;

uniform float u_stroke_width : 2;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

#pragma include "decode"
#pragma include "projection"

void main() {
  // unpack color(vec2)
  v_color = decode_color(a_packed_data.xy);
  // unpack picking_id
  float picking_id = a_packed_data.w;

  // unpack data(extrude(4-bit), radius(16-bit))
  float compressed = a_packed_data.z;

  // extrude(4-bit)
  vec2 extrude;
  extrude.x = floor(compressed * SHIFT_RIGHT23);
  compressed -= extrude.x * SHIFT_LEFT23;
  extrude.x = extrude.x - 1.;

  extrude.y = floor(compressed * SHIFT_RIGHT21);
  compressed -= extrude.y * SHIFT_LEFT21;
  extrude.y = extrude.y - 1.;

  float shape_type = floor(compressed * SHIFT_RIGHT17);
  compressed -= shape_type * SHIFT_LEFT17;

  // radius(16-bit)
  float radius = compressed;
  v_radius = radius;

  vec2 offset = project_pixel(extrude * (radius + u_stroke_width));
  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

  // TODO: billboard
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

  // anti-alias
  float antialiasblur = 1.0 / (radius + u_stroke_width);

  // construct point coords
  v_data = vec4(extrude, antialiasblur, shape_type);
}
