attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Extrude;
attribute float a_Size;
attribute vec2 a_Uv;

uniform mat4 u_ModelMatrix;

uniform mat2 u_RotateMatrix;
uniform int u_size_unit;

varying vec2 v_uv; // 本身的 uv 坐标
varying vec2 v_Iconuv; // icon 贴图的 uv 坐标

uniform float u_raisingHeight: 0.0;
uniform float u_heightfixed: 0.0;
varying float v_opacity;
// uniform vec2 u_offsets; // shader 注入


#pragma include "projection"
#pragma include "picking"
#pragma include "rotation_2d"

void main() {
  vec3 extrude = a_Extrude;
  v_uv = (a_Extrude.xy + 1.0)/2.0;
  v_uv.y = 1.0 - v_uv.y;
  v_Iconuv = a_Uv;
  v_opacity = opacity;
  float newSize = a_Size;
  if(u_size_unit == 1) {
    newSize = newSize  * u_PixelsPerMeter.z;
  }
  
  // vec2 offset = (u_RotateMatrix * extrude.xy * (a_Size) + textrueOffsets);
  vec2 offset = (extrude.xy * (newSize) + offsets);

  offset = rotate_matrix(offset,rotation);

  vec3 aPosition = a_Position;

  offset = project_pixel(offset);

  vec4 project_pos = project_position(vec4(aPosition.xy, 0.0, 1.0));
  float raisingHeight = u_raisingHeight;
  if(u_heightfixed < 1.0) { // height fixed
    raisingHeight = project_pixel(u_raisingHeight);
  } else {
    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
      raisingHeight = u_raisingHeight * mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xy + offset, 0.0, 1.0));

  setPickingColor(a_PickingColor);
}
