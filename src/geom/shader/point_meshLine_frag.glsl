precision highp float;
varying float v_pickingId;
varying vec4 v_color;
void main() {
    if(v_pickingId < -0.1) {
        discard;
    }
    #ifdef ANIMATE 
    if (vTime > 1.0 || vTime < 0.0) {
        discard;
    } 
    #endif
    gl_FragColor = v_color;
    #pragma include "pick"
}
