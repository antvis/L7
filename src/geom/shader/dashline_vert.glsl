precision highp float;
attribute float a_miter;
attribute vec4 a_color;
attribute float a_size;
uniform float u_zoom;
varying vec4 v_color;
attribute float a_distance;
varying float v_lineU;
uniform float u_activeId;
uniform vec4 u_activeColor;
void main() {
 v_lineU = a_distance;
 mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
 vec3 pointPos = position.xyz + vec3(normal * a_size * pow(2.0,20.0-u_zoom) / 2.0 * a_miter);
 v_color = a_color;
  if(pickingId == u_activeId) {
    v_color = u_activeColor;
  }
 gl_Position = matModelViewProjection * vec4(pointPos, 1.0);
 worldId = id_toPickColor(pickingId);
}