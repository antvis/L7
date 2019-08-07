
attribute vec4 a_color;
uniform float u_zoom;
uniform float u_opacity;
varying vec4 v_color;
uniform float u_activeId;
uniform vec4 u_activeColor;
void main(){
  mat4 matModelViewProjection=projectionMatrix*modelViewMatrix;
  v_color=a_color;
  v_color.a*=u_opacity;
  if(pickingId==u_activeId){
    v_color = u_activeColor;
  }
  gl_Position=projectionMatrix*vec4(position.xy / 4096.,0.,1.);
  
}