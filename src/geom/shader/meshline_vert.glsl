precision highp float;
attribute float a_miter;
attribute vec4 a_color;
attribute float a_size;
attribute float a_distance;
uniform float u_zoom;
varying vec4 v_color;
uniform float u_time;
varying float vTime;
uniform float u_activeId;
uniform vec4 u_activeColor;
//  animate 
#ifdef ANIMATE 
uniform float u_duration;  // 动画持续时间
uniform float u_interval;
uniform float u_repeat;
uniform float u_trailLength;
#endif


void main() {
 mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
 vec3 pointPos = vec3(position.xy,0.) + vec3(normal * a_size * pow(2.0,20.0-u_zoom) / 2.0 * a_miter);
 v_color = a_color;
 if(pickingId == u_activeId) {
    v_color = u_activeColor;
  }
  #ifdef ANIMATE 
    //mod(a_distance,0.2) * 5.
     float alpa =1.0 - fract( mod(1.0- a_distance,u_interval)* (1.0/u_interval) + u_time / u_duration);
     alpa = (alpa + u_trailLength -1.0) / u_trailLength;
     vTime = clamp(alpa,0.,1.);
      // vTime = (28800. + mod(u_time* 1000.,28800.)- position.z) / 100.;
  #endif
 worldId = id_toPickColor(pickingId);
 gl_Position = matModelViewProjection * vec4(pointPos.xy, 0., 1.0);

}