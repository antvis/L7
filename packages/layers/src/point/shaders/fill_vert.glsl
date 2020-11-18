attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec2 a_Extrude;
attribute float a_Size;
attribute float a_Shape;
uniform mat4 u_ModelMatrix;

uniform float u_stroke_width : 2;
uniform vec2 u_offsets;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

#pragma include "projection"
#pragma include "picking"

void main() {
  // unpack color(vec2)
  v_color = a_Color;
  vec2 extrude = a_Extrude;

  float shape_type = a_Shape;

  float newSize = setPickingSize(a_Size);

  // radius(16-bit)
  v_radius = newSize;

  vec2 offset = project_pixel(extrude * (newSize + u_stroke_width) + u_offsets);
  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

  // TODO: billboard
  // anti-alias
  float antialiasblur = 1.0 / u_DevicePixelRatio / (newSize + u_stroke_width);

  // construct point coords
  v_data = vec4(extrude, antialiasblur,shape_type);

  setPickingColor(a_PickingColor);
}
