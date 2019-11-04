varying vec4 v_color;
uniform float u_Opacity: 1.0;
#define PI 3.141592653589793

void main() {
   gl_FragColor = v_color;
   gl_FragColor.a *= u_Opacity;

}
