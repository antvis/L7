  precision mediump float;
  uniform float u_opacity;
  varying vec4 v_color;
  uniform float u_time : 0;

  #if defined DASHLINE  || defined ANIMATE
    varying float v_distance_ratio;
  #endif

  #ifdef ANIMATE 
  uniform float u_duration : 2.0;
  uniform float u_interval : 1.0;
  uniform float u_trailLength : 0.2;
  #endif

  
  void main() {
      if(v_color.a == 0.){
        discard;
      }
   
      gl_FragColor = v_color;
      gl_FragColor.a = v_color.a*u_opacity;
      #ifdef ANIMATE
        float alpha =1.0 - fract( mod(1.0- v_distance_ratio, u_interval)* (1.0/u_interval) + u_time / u_duration);
          // alpha = (alpha + u_trailLength -1.0) / u_trailLength;
          // alpha = smoothstep(0., 1., alpha);
        gl_FragColor.a *= alpha;
   
      #endif

      #pragma include "pick"
  }