precision highp float;
attribute vec3 miter;
attribute vec4 a_color;
uniform float u_xOffset;
uniform float u_yOffset;
uniform float u_coverage;
uniform float u_opacity;
uniform float u_activeId;
uniform vec4 u_activeColor;
varying vec4 v_color;

#pragma include "lighting"

void main() {
   mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
   v_color = a_color;
   v_color.a *= u_opacity;

 if(pickingId == u_activeId) {
     v_color = u_activeColor;
    }
  float x = position.x + miter.x * u_xOffset * u_coverage;
  float y = position.y + miter.y * u_yOffset * u_coverage;
  float z = position.z + miter.z;

   #ifdef LIGHTING
      vec3 viewDir = normalize(cameraPosition - vec3(x, y, z));
      v_color.rgb *= calc_lighting(vec3(x, y, z), normal, viewDir);
  #endif
    
    

  gl_Position = matModelViewProjection * vec4(x, y, z, 1.0);
   worldId = id_toPickColor(pickingId);
}