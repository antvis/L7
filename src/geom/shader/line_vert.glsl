    precision highp float;
    attribute vec4 a_color;
    attribute float a_time;
    uniform float currentTime;
    varying float vTime;
    varying vec4 v_color;
    void main() {
      mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
      v_color = a_color;
    
      // vTime = 1.0 - (mod(currentTime,a_time)+ 1000.0 - position.z) / 100.0;
      gl_Position = matModelViewProjection * vec4(position.xy,0., 1.0);
    }