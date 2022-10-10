
uniform sampler2D u_texture;
uniform float u_mapFlag;
uniform float u_opacity;

varying vec3 v_Color;
varying vec2 v_uv;
varying float v_clip;

#pragma include "picking"
void main() {
  // gl_FragColor = vec4(v_Color, u_opacity);
  if(u_mapFlag > 0.0) {
    gl_FragColor = texture2D(u_texture, vec2(v_uv.x, 1.0 - v_uv.y));
    gl_FragColor.a *= u_opacity;
  } else {
    // gl_FragColor = vec4(v_uv, 0.0, u_opacity);
    gl_FragColor = vec4(v_Color, u_opacity);
  }
  gl_FragColor.a *= v_clip;
  gl_FragColor = filterColor(gl_FragColor);
}
