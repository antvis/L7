precision highp float;
attribute float a_miter;
attribute vec4 a_color;
attribute float a_size;
uniform float u_zoom;
varying vec4 v_color;
attribute float a_distance;
varying float v_lineU;
void main() {
 v_lineU = a_distance;
 mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
 vec3 pointPos = position.xyz + vec3(normal * a_size * pow(2.0,20.0-u_zoom) / 2.0 * a_miter);
 v_color = a_color;
 gl_Position = matModelViewProjection * vec4(pointPos, 1.0);
}