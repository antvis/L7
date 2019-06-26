precision mediump float;
attribute vec2 a_txtsize;
attribute vec2 a_txtOffsets;
uniform float u_opacity;
attribute vec4 a_color;
uniform vec2 u_textTextureSize;// 纹理大小
uniform vec2 u_glSize;
varying vec2 v_texcoord;
varying vec4 v_color;
varying float v_size;
uniform float u_activeId;
uniform vec4 u_activeColor;

void main(){
  mat4 matModelViewProjection=projectionMatrix*modelViewMatrix;
  vec4 cur_position=matModelViewProjection*vec4(position.xy,0,1);
  v_size = 12. / u_glSize.x;
  gl_Position=cur_position/cur_position.w+vec4((a_txtOffsets+a_txtsize)/u_glSize*2.,0.,0.);
  v_color=vec4(a_color.rgb,a_color.a*u_opacity);
  if(pickingId==u_activeId){
    v_color=u_activeColor;
  }
  v_texcoord=uv/u_textTextureSize;
  worldId=id_toPickColor(pickingId);
  
}
