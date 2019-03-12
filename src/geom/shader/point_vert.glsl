precision highp float;
attribute vec4 a_color;
attribute float a_size;
attribute float a_shape;
uniform vec4 u_stroke;
uniform float u_strokeWidth;
uniform float u_opacity;
uniform float u_zoom;
varying vec4 v_color;
varying vec2 v_rs;
varying vec2 v_uv;
varying float v_shape;
uniform float u_activeId;
uniform vec4 u_activeColor;
void main() {
  mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
   v_color = a_color;
    if(pickingId == u_activeId) {
     v_color = u_activeColor;
   }
   gl_Position =  matModelViewProjection  * vec4(position, 1.0);
   gl_PointSize = a_size;
   v_rs = vec2(a_size / 2.0, a_size / 2.0- u_strokeWidth);
    #ifdef TEXCOORD_0
      
       v_uv = uv;
    #endif
    #ifdef SHAPE
      v_shape = a_shape;
    #endif
    worldId = id_toPickColor(pickingId);
}

