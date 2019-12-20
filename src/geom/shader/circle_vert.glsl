// attribute vec4 a_packed_data;
attribute vec4 a_color;
attribute float a_size;
attribute float a_shape;
attribute vec2 miter;

uniform float u_zoom : 1.;
uniform float u_stroke_width : 2.;
uniform float u_activeId : 0.;
uniform vec4 u_activeColor : [ 1.0, 0, 0, 1.0 ];

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

#pragma include "decode"

void main() {
  // unpack color(vec2)
  // v_color = decode_color(a_packed_data.xy);
  v_color = a_color;
  // unpack pickingId
  // float pickingId = a_packed_data.w;
    // float pickingId = .w;

  // unpack data(extrude(4-bit), radius(16-bit))
  // float compressed = a_packed_data.z;

  // // extrude(4-bit)
  vec2 extrude = miter;
  // extrude.x = floor(compressed * SHIFT_RIGHT23);
  // compressed -= extrude.x * SHIFT_LEFT23;
  // extrude.x = extrude.x - 1.;

  // extrude.y = floor(compressed * SHIFT_RIGHT21);
  // compressed -= extrude.y * SHIFT_LEFT21;
  // extrude.y = extrude.y - 1.;

  // float shape_type = floor(compressed * SHIFT_RIGHT17);
  // compressed -= shape_type * SHIFT_LEFT17;

  // radius(16-bit)
  float radius = a_size;
  v_radius = radius;

  float zoom_scale = pow(2., 20. - u_zoom);
  vec2 offset = miter * (radius + u_stroke_width) * zoom_scale;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy + offset, 0.0, 1.0);

  // anti-alias
  float antialiasblur = 1.0 / (radius + u_stroke_width);

  // construct point coords
  v_data = vec4(extrude, antialiasblur, a_shape);

  // picking
  if(pickingId == u_activeId) {
    v_color = u_activeColor;
  }
  #ifdef PICK
    worldId = id_toPickColor(pickingId);
  #endif
}
