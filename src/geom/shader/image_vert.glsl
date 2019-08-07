precision highp float;
varying vec2 v_texCoord;
void main() {
   mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
   v_texCoord = uv;
   gl_Position =  matModelViewProjection * vec4(position, 1.0);
}