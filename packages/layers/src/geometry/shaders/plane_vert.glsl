precision highp float;
uniform mat4 u_ModelMatrix;

uniform float u_opacity;
uniform float u_terrainClipHeight;

attribute vec3 a_Position;
attribute vec2 a_Uv;
attribute vec3 a_Color;

varying vec3 v_Color;
varying vec2 v_uv;
varying float v_clip;

#pragma include "projection"
#pragma include "picking"
void main() {
   v_Color = a_Color;
   v_uv = a_Uv;
  
   vec4 project_pos = project_position(vec4(a_Position, 1.0));

   v_clip = 1.0;
   if(a_Position.z < u_terrainClipHeight) {
      v_clip = 0.0;
   }
  
  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xy, a_Position.z, 1.0));

   setPickingColor(a_PickingColor);
}
