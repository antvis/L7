attribute vec4 a_Color;
attribute vec3 a_Position;

uniform mat4 u_ModelMatrix;

uniform float u_raisingHeight: 0.0;

varying vec4 v_Color;


#pragma include "projection"
#pragma include "picking"

uniform float u_opacitylinear: 0.0;

attribute vec3 a_linear;
varying vec3 v_linear;
varying vec2 v_pos;

void main() {
  if(u_opacitylinear > 0.0) {
    v_linear = a_linear;
    v_pos = a_Position.xy;
  }
  v_Color = vec4(a_Color.xyz, a_Color.w * opacity);
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  project_pos.z += u_raisingHeight;

  if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
    float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
    project_pos.z *= mapboxZoomScale;
    project_pos.z += u_raisingHeight * mapboxZoomScale;
  }

   gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xyz, 1.0));
  setPickingColor(a_PickingColor);
}