precision highp float;

#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute float a_Size;
uniform mat4 u_ModelMatrix;

attribute vec2 a_Uv;
varying vec2 v_texCoord;

varying vec4 v_Color;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size, 1.0);
  vec4 project_pos = project_position(pos);
   v_texCoord = a_Uv;
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  float lightWeight = calc_lighting(pos);
  // v_Color = a_Color;
  v_Color = vec4(a_Color.rgb * lightWeight, a_Color.w);

  setPickingColor(a_PickingColor);
}
