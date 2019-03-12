precision highp float;
uniform float u_strokeOpacity;
uniform vec4 u_stroke;
uniform float u_activeId;
uniform vec4 u_activeColor;
varying float v_pickingId;
void main() {
    if(v_pickingId < -0.1) {
        discard;
    }
    #ifdef ANIMATE 
    if (vTime > 1.0 || vTime < 0.0) {
        discard;
    } 
    #endif
    gl_FragColor = u_stroke;
    gl_FragColor.a =  u_stroke.a * u_strokeOpacity ;
    if(v_pickingId == u_activeId) {
        gl_FragColor = u_activeColor;
    }
}
