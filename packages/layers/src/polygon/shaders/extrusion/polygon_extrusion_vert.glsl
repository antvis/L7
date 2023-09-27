precision highp float;

#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute float a_Size;
uniform mat4 u_ModelMatrix;




varying vec4 v_Color;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
 
  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size + (1.0 - a_Position.z) * extrusionBase, 1.0);
  float lightWeight = calc_lighting(pos);
  vec4 project_pos = project_position(pos);
  v_Color = a_Color;
  v_Color = vec4(v_Color.rgb * lightWeight, v_Color.w * opacity);

  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xyz, 1.0));

  setPickingColor(a_PickingColor);
}
