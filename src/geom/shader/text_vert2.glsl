precision mediump float;
attribute vec3 a_position;
attribute vec4 textUv;
attribute vec2 a_textSize;
attribute vec2 a_textOffset;// 文本偏移
attribute vec4 a_color;
uniform mat4 u_model;
uniform float u_opacity;
uniform mat4 u_view;
uniform mat4 u_scale;
uniform vec2 u_textTextureSize;// 纹理大小
uniform float u_activeId;
uniform vec4 u_activeColor;
uniform vec2 u_glSize;// 画布大小
varying vec2 v_texcoord;
varying vec4 v_color;

void main(){
  mat4 matModelViewProjection=projectionMatrix*modelViewMatrix;
  vec4 cur_position=matModelViewProjection*vec4(a_position.xy,0,1);
  gl_Position=cur_position / cur_position.w+ vec4(a_textSize*position.xy/u_glSize, 0., 0.)+vec4(a_textOffset/u_glSize * 2.0,0,0);
  v_color=vec4(a_color.rgb,a_color.a*u_opacity);
  if(pickingId == u_activeId) {
     v_color = u_activeColor;
   }
  v_texcoord=(textUv.xy + vec2(uv.x,1.-uv.y) * textUv.zw)/u_textTextureSize;
  worldId = id_toPickColor(pickingId);
  
}
