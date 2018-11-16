    precision highp float;
    attribute vec4 a_color;
    uniform float currentTime;
    uniform float u_time;
    varying float vTime;
    varying vec4 v_color;
    void main() {
      mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
      v_color = a_color;
      #ifdef ANIMATE 
        vTime = 1.0- (mod(u_time*100.,3600.)- position.z) / 100.;
      #endif
      gl_Position = matModelViewProjection * vec4(position.xy,0., 1.0);
    }