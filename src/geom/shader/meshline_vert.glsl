attribute float a_miter;
attribute vec4 a_color;
attribute float a_size;
attribute float a_distance;
attribute float a_dash_array;
attribute float a_total_distance;

uniform float u_zoom;
uniform float u_time : 0;
uniform float u_activeId : 0;
uniform vec4 u_activeColor : [ 1.0, 0, 0, 1.0 ];

varying float v_time;
varying vec4 v_color;
varying float v_dash_array;
varying vec2 v_normal;
#if defined DASHLINE  || defined ANIMATE
varying float v_distance_ratio;
#endif

#ifdef ANIMATE 
uniform float u_duration : 2.0;
uniform float u_interval : 1.0;
uniform float u_trailLength : 0.2;
#endif

#ifdef TEXTURE
attribute vec2 a_texture_coord;
uniform float u_pattern_spacing : 0.0;
varying vec2 v_uv;
varying float v_texture_y;
varying float v_texture_percent;
#endif
void main() {
  // extrude along normal
  float extrude_scale = pow(2.0, 20.0 - u_zoom);
  v_color = a_color;
  v_dash_array = a_dash_array;
  float distance_ratio = a_distance / a_total_distance;
#if defined DASHLINE  || defined ANIMATE
    v_distance_ratio = distance_ratio;
  #endif
  #ifdef TEXTURE
    v_uv = vec2(a_texture_coord.x + 0.125, a_texture_coord.y);
    if (a_miter > 0.0) {
      v_uv.x = a_texture_coord.x;
    }
    v_texture_y = a_distance / extrude_scale / (a_size + u_pattern_spacing);
    v_texture_percent = a_size / (a_size + u_pattern_spacing);
  #endif

  // anti-alias
  v_normal = vec2(normal * sign(a_miter));

  
  vec3 offset = vec3(normal * a_size * extrude_scale / 2.0 * a_miter);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy + offset.xy, 0., 1.0);
  // gl_Position.z -=0.8 * gl_Position.w;

  // picking
  if(pickingId == u_activeId) {
    v_color = u_activeColor;
  }
 #ifdef PICK
    worldId = id_toPickColor(pickingId);
   #endif
}