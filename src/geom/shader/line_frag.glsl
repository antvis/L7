    precision highp float;
 
    varying vec4 v_color;
    // varying float vTime;
    void main() {
    // if (vTime > 1.0 || vTime < 0.0) {
    //     discard;
    //  }  
    gl_FragColor = v_color;
 
    //   gl_FragColor.a = gl_FragColor.a * vTime;
    }