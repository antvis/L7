uniform float u_blur : 0.9;
varying vec4 v_color;
varying vec3 v_normal;
void main() {
   gl_FragColor = v_color;
  // anti-alias
  // float blur = 1. - smoothstep(u_blur, 1., length(v_normal));
  // gl_FragColor.a *= blur;
}