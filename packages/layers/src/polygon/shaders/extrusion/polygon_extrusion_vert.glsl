precision highp float;

#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute float a_Size;
uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform sampler2D u_texture;



varying vec4 v_Color;
uniform float u_extrusionBase: 0.0; // 默认不固定

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
 
  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size, 1.0);
  float lightWeight = calc_lighting(pos);
  vec4 project_pos = project_position(pos);


  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    // gl_Position = u_Mvp * (vec4(project_pos.xyz * vec3(1.0, 1.0, -1.0), 1.0));
    gl_Position = u_Mvp * (vec4(project_pos.xyz, 1.0));
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
  }




  setPickingColor(a_PickingColor);
}
