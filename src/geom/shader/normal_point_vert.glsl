precision highp float;
attribute vec4 a_color;
attribute float a_size;
varying vec4 v_color;
uniform float u_activeId;
uniform vec4 u_activeColor;
uniform float u_opacity;

void main(){
  mat4 matModelViewProjection=projectionMatrix*modelViewMatrix;
  v_color=a_color;
  v_color.a*=u_opacity;
  if(pickingId==u_activeId){
    v_color=u_activeColor;
  }
  gl_Position=matModelViewProjection*vec4(position,1.);
  gl_PointSize=a_size;
  
  #ifdef PICK
    worldId = id_toPickColor(pickingId);
   #endif
}

