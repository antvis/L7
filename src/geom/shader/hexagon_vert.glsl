precision highp float;
// attribute vec2 miter;
attribute vec3 miter;
attribute vec3 a_shape;
attribute float a_size;
attribute vec4 a_color;
uniform float u_radius;
uniform float u_coverage;
uniform float u_opacity;
uniform float u_angle;

uniform float u_activeId;
uniform vec4 u_activeColor;
varying vec4 v_color;

#pragma include "lighting"

void main() {
   mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
   mat2 rotationMatrix = mat2(cos(u_angle), sin(u_angle), -sin(u_angle), cos(u_angle));
   v_color = a_color;
   v_color.a *= u_opacity;
   if(pickingId == u_activeId) {
     v_color = u_activeColor;
   }
   vec2 offset =vec2(rotationMatrix * miter.xy * u_radius * u_coverage );
  // vec2 offset =vec2(rotationMatrix * a_shape.xy * u_radius * u_coverage );
  float x = position.x + offset.x;
  float y = position.y + offset.y;
  // float z = a_shape.z * a_size;
  float z = miter.z * a_size;

  #ifdef LIGHTING
    vec3 viewDir = normalize(cameraPosition - vec3(x, y, z));
    v_color.rgb *= calc_lighting(vec3(x, y, z), normal, viewDir);
  #endif
    
  gl_Position = matModelViewProjection * vec4(x, y, z, 1.0);

   worldId = id_toPickColor(pickingId);
}