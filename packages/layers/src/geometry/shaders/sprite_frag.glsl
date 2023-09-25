
uniform sampler2D u_texture;
uniform float u_mapFlag;
uniform float u_opacity;

varying vec3 v_Color;
varying float v_d;

void main() {

  if(v_d < 0.0) {
    discard;
  }

  if(u_mapFlag > 0.0) {
    gl_FragColor = texture2D(u_texture, gl_PointCoord);
    gl_FragColor.a *= u_opacity;
  } else {
    gl_FragColor = vec4(v_Color, u_opacity);
  }
}
