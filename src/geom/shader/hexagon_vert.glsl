precision highp float;
attribute vec2 miter;
attribute vec4 a_color;
uniform float u_radius;
uniform float u_coverage;
uniform float u_angle;
varying vec4 v_color;

void main() {
   mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
   mat2 rotationMatrix = mat2(cos(u_angle), sin(u_angle), -sin(u_angle), cos(u_angle));
   v_color = a_color;
   vec2 offset =vec2(rotationMatrix * miter * u_radius * u_coverage );
  float x = position.x + offset.x;
  float y = position.y + offset.y;
  gl_Position = matModelViewProjection * vec4(x, y, position.z, 1.0);
}