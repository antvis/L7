precision mediump float;
uniform vec2 u_rminmax: vec2(0,255); 
uniform vec2 u_gminmax: vec2(0,255);
uniform vec2 u_bminmax: vec2(0,255);
uniform float u_opacity: 1.0;
uniform sampler2D u_texture;
uniform float u_noDataValue : 0.0;
varying vec2 v_texCoord;

void main() {
  vec3 rgb = texture2D(u_texture,vec2(v_texCoord.x,v_texCoord.y)).rgb;
  if(rgb == vec3(u_noDataValue)) {
    gl_FragColor = vec4(0.0, 0, 0, 0.0);
  } else {
    gl_FragColor = vec4(rgb.r / (u_rminmax.y -u_rminmax.x), rgb.g /(u_gminmax.y -u_gminmax.x), rgb.b/ (u_bminmax.y - u_bminmax.x), u_opacity);
  }
  if(gl_FragColor.a < 0.01)
    discard;
 
}