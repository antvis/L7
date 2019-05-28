attribute float a_miter;
attribute vec4 a_color;
attribute float a_size;
attribute float a_distance;
attribute float a_dash_array;

uniform float u_zoom;
uniform float u_time : 0;
uniform float u_activeId : 1;
uniform vec4 u_activeColor : [ 1.0, 0, 0, 1.0 ];

varying float v_time;
varying vec4 v_color;
varying float v_distance;
varying float v_dash_array;
varying vec2 v_normal;

#ifdef ANIMATE 
uniform float u_duration : 2.0;
uniform float u_interval : 1.0;
uniform float u_trailLength : 0.2;
#endif

void main() {
  v_color = a_color;
  v_distance = a_distance;
  v_dash_array = a_dash_array;

  // anti-alias
  v_normal = vec2(normal * sign(a_miter));

  // extrude along normal
  float extrude_scale = pow(2.0, 20.0 - u_zoom);
  vec3 offset = vec3(normal * a_size * extrude_scale / 2.0 * a_miter);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy + offset.xy, 0., 1.0);

  #ifdef ANIMATE
    float alpha =1.0 - fract( mod(1.0- a_distance,u_interval)* (1.0/u_interval) + u_time / u_duration);
    alpha = (alpha + u_trailLength -1.0) / u_trailLength;
    v_time = clamp(alpha,0.,1.);
  #endif

  // picking
  if(pickingId == u_activeId) {
    v_color = u_activeColor;
  }
  worldId = id_toPickColor(pickingId);
}