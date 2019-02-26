precision highp float;
attribute vec2 miter;
attribute vec4 a_color;
uniform float u_xOffset;
uniform float u_yOffset;
uniform float u_coverage;
varying vec4 v_color;

void main() {
   mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
   v_color = a_color;
  float x = position.x + miter.x * u_xOffset * u_coverage;
  float y = position.y + miter.y * u_yOffset * u_coverage;
  gl_Position = matModelViewProjection * vec4(x, y, position.z, 1.0);
}