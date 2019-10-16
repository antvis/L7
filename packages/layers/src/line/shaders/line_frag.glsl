uniform float u_blur : 0.99;
varying vec4 v_color;
varying vec3 v_normal;
void main() {
   gl_FragColor = v_color;
  // anti-alias
  float blur = smoothstep(u_blur, 1., length(v_normal.xy));
  gl_FragColor.a *= blur;
}