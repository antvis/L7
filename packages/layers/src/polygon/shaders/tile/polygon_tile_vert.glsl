attribute vec4 a_Color;
attribute vec3 a_Position;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

// uniform vec2 u_tileOrigin;
// uniform float u_coord;

varying vec4 v_color;

#pragma include "projection"
#pragma include "picking"

void main() {
  v_color = a_Color;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  // if(u_coord > 0.0) {
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
      gl_Position = u_Mvp * (vec4(project_pos.xyz, 1.0));
    } else {
      gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
    }
  // } else {
  //   vec4 world = vec4(project_mvt_offset_position(vec4(u_tileOrigin, 0.0, 1.0)).xyz, 1.0); // 瓦片起始点的世界坐标

  //   vec2 pointOffset = a_Position.xy *  pow(2.0, u_Zoom); // 瓦片内的点的偏移坐标
    
  //   world.xy += pointOffset;

  //   if (u_CoordinateSystem == COORDINATE_SYSTEM_METER_OFFSET || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
  //     // Needs to be divided with project_uCommonUnitsPerMeter
  //     world.w *= u_PixelsPerMeter.z;
  //   }

  //   gl_Position = u_ViewProjectionMatrix * world + u_ViewportCenterProjection;
  // }

  setPickingColor(a_PickingColor);
}

