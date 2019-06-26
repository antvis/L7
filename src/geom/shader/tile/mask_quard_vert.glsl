precision highp float;
void main(){
  mat4 matModelViewProjection=projectionMatrix*modelViewMatrix;
  gl_Position =  matModelViewProjection * vec4(position, 1.0);
  
}