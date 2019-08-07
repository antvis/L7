precision highp float;

attribute vec4 a_color; 

#ifdef SHAPE
attribute vec3 a_size;
attribute vec3 a_shape;
#endif

#ifdef ANIMATE
attribute vec2 faceUv;
varying vec2 v_texCoord;
#endif

varying vec4 v_color;

uniform float u_zoom : 0;
uniform float u_opacity : 1.0;
uniform float u_activeId : -1;
uniform vec4 u_activeColor : [1.0, 0.0, 0.0, 1.0];

#pragma include "lighting"

void main() {
  #ifdef ANIMATE
    v_texCoord = faceUv;
  #endif
  v_color = a_color;
  v_color.a *= u_opacity;

  // put offset in world space & shrink with current zoom level
  float scale = pow(2.0,(20.0 - u_zoom));
  vec3 offset = vec3(0.);
  #ifdef SHAPE
    offset = vec3(a_size * scale * a_shape);
  #endif
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + offset, 1.);

  #ifdef LIGHTING
    if (normal != vec3(0., 0., 1.0)) {
      vec3 viewDir = normalize(cameraPosition - position);
      v_color.rgb *= calc_lighting(position, normal, viewDir);
    }
  #endif

  if(pickingId == u_activeId) {
    v_color = u_activeColor;
  }
   #ifdef PICK
    worldId = id_toPickColor(pickingId);
   #endif
}