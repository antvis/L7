attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Extrude;
attribute float a_Size;
attribute float a_Shape;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

// uniform vec2 u_tileOrigin;
// uniform float u_coord;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

uniform float u_opacity : 1;
uniform float u_stroke_opacity : 1;
uniform float u_stroke_width : 2;
uniform vec4 u_stroke_color : [0.0, 0.0, 0.0, 0.0];

#pragma include "projection"
#pragma include "picking"

void main() {
  vec3 extrude = a_Extrude;
  float shape_type = a_Shape;
  float newSize = setPickingSize(a_Size);

  // cal style mapping

  v_color = a_Color;
  v_radius = newSize;

  // anti-alias
  //  float antialiased_blur = -max(u_blur, antialiasblur);
  float antialiasblur = -max(2.0 / u_DevicePixelRatio / a_Size, 0.0);

  vec2 offset = (extrude.xy * (newSize + u_stroke_width));
  offset = project_pixel(offset);

  v_data = vec4(extrude.x, extrude.y, antialiasblur,shape_type);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
    float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
  }

// if(u_coord > 0.0) {
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(project_pos.xy + offset, 0.0, 1.0);
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));
  }
// } else {

  // vec2 pointPos = a_Position.xy;
  // vec4 world = vec4(project_mvt_offset_position(vec4(u_tileOrigin, 0.0, 1.0)).xyz, 1.0); // 瓦片起始点的世界坐标

  // vec2 pointOffset =  pointPos *  pow(2.0, u_Zoom); // 瓦片内的点的偏移坐标
  
  // world.xy += offset;
  // world.xy += pointOffset;

  // if (u_CoordinateSystem == COORDINATE_SYSTEM_METER_OFFSET || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
  //   // Needs to be divided with project_uCommonUnitsPerMeter
  //   world.w *= u_PixelsPerMeter.z;
  // }

  // gl_Position = u_ViewProjectionMatrix * world + u_ViewportCenterProjection;
// }

 
  setPickingColor(a_PickingColor);


}
