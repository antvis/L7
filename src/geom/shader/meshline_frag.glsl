precision highp float;
uniform float u_opacity;
varying vec4 v_color;
varying float vTime;
void main() {
    gl_FragColor = v_color;
    gl_FragColor.a =  v_color.a * u_opacity;
    #ifdef ANIMATE 
       gl_FragColor.a *= vTime;
    #endif
}
