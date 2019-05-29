attribute float a_radius;
attribute vec2 a_shape;
attribute vec4 a_color;

uniform float u_zoom : 1;
uniform float u_stroke_width : 2;
uniform float u_activeId : 0;
uniform vec4 u_activeColor : [ 1.0, 0, 0, 1.0 ];

varying vec3 v_data;
varying vec4 v_color;
varying float v_radius;

void main() {
  v_color = a_color;
  v_radius = a_radius;

  // extrude
  float zoom_scale = pow(2., 20. - u_zoom);
  vec2 offset = a_shape * (a_radius + u_stroke_width) * zoom_scale;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy + offset, 0.0, 1.0);

  // anti-alias
  float antialiasblur = 1.0 / (a_radius + u_stroke_width);

  // construct point coords
  v_data = vec3(a_shape, antialiasblur);

  // picking
  if(pickingId == u_activeId) {
    v_color = u_activeColor;
  }
  worldId = id_toPickColor(pickingId);
}