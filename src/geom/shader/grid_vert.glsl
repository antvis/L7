precision highp float;
attribute vec2 miter;
attribute vec4 a_color;
uniform float u_xOffset;
uniform float u_yOffset;
uniform float u_coverage;
uniform float u_opacity;
uniform float u_activeId;
uniform vec4 u_activeColor;
varying vec4 v_color;

void main() {
   mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
   v_color = a_color;
   v_color.a *= u_opacity;
    if(pickingId == u_activeId) {
     v_color = u_activeColor;
   }
  float x = position.x + miter.x * u_xOffset * u_coverage;
  float y = position.y + miter.y * u_yOffset * u_coverage;
  gl_Position = matModelViewProjection * vec4(x, y, position.z, 1.0);
   worldId = id_toPickColor(pickingId);
}