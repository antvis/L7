attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec2 a_Extrude;
attribute float a_Size;
attribute float a_stroke_opacity;
attribute float a_Shape;

attribute vec2 a_featureId;
varying vec2 v_featureId;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

uniform float u_stroke_width : 2;
uniform vec2 u_offsets;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;
varying float v_stroke_opacity;

#pragma include "projection"
#pragma include "picking"

void main() {
  vec2 extrude = a_Extrude;
  float shape_type = a_Shape;
  float newSize = setPickingSize(a_Size);

  // unpack color(vec2)
  v_color = a_Color;
  v_stroke_opacity = a_stroke_opacity;

  v_featureId = a_featureId;

  // radius(16-bit)
  v_radius = newSize;

  // TODO: billboard
  // anti-alias
  float antialiasblur = 1.0 / u_DevicePixelRatio / (newSize + u_stroke_width);

  // construct point coords
  v_data = vec4(extrude, antialiasblur,shape_type);

  vec2 offset = project_pixel(extrude * (newSize + u_stroke_width) + u_offsets);
  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));
  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(project_pos.xy + offset, 0.0, 1.0);
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));
  }

  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

  setPickingColor(a_PickingColor);
}
