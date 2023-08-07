precision highp float;
attribute vec3 a_Position;
attribute vec4 a_Color;
attribute vec2 a_Uv;
attribute float a_Size;
varying vec4 v_color;
varying vec2 v_uv;
uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform vec2 u_offsets;

uniform float u_opacity : 1;
uniform float u_raisingHeight: 0.0;
uniform float u_heightfixed: 0.0;


#pragma include "projection"
#pragma include "picking"

void main() {

  // cal style mapping - 数据纹理映射部分的计算
  v_color = a_Color;
  v_uv = a_Uv;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
   
  vec2 offset = project_pixel(u_offsets);

  float raisingHeight = u_raisingHeight;
  if(u_heightfixed < 1.0) { // false
    raisingHeight = project_pixel(u_raisingHeight);
  } else {
     if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
      raisingHeight = u_raisingHeight * mapboxZoomScale;
    }
  }

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(project_pos.xy + offset, raisingHeight, 1.0);
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, raisingHeight, 1.0));
  }

  gl_PointSize = a_Size * 2.0 * u_DevicePixelRatio;
  setPickingColor(a_PickingColor);
}
