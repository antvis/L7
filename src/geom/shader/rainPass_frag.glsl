precision mediump float;
uniform sampler2D u_texture;
varying float v_time;
varying vec2 v_texCoord;


void main() {
  vec4 color =  texture2D(u_texture, v_texCoord);
  if(color.w ==0.)
    discard;
 gl_FragColor = texture2D(u_texture, v_texCoord);

}