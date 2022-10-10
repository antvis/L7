attribute float a_Miter;
attribute vec4 a_Color;
attribute vec2 a_Size;
attribute vec3 a_Normal;
attribute vec3 a_Position;

// uniform vec2 u_tileOrigin;
// uniform float u_coord;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;


#pragma include "projection"
#pragma include "picking"

varying vec4 v_color;

void main() {
  v_color = a_Color;

  vec3 size = a_Miter * setPickingSize(a_Size.x) * reverse_offset_normal(a_Normal);
  
  vec2 offset = project_pixel(size.xy);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));

  // if(u_coord > 0.0) { // 使用经纬度坐标
      if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
      gl_Position = u_Mvp * (vec4(project_pos.xy + offset, 0.0, 1.0));
    } else {
      gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));
    }
  // } else { // 使用偏移坐标
  //   vec2 pointPos = a_Position.xy;
  //   vec4 tileWorld = vec4(project_mvt_offset_position(vec4(u_tileOrigin, 0.0, 1.0)).xyz, 1.0); // 瓦片起始点的世界坐标

  //   vec2 pointOffset =  pointPos *  pow(2.0, u_Zoom); // 瓦片内的点的偏移坐标
    
  //   tileWorld.xy += pointOffset;

  //   tileWorld.xy += offset;

  //   if (u_CoordinateSystem == COORDINATE_SYSTEM_METER_OFFSET || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
  //     // Needs to be divided with project_uCommonUnitsPerMeter
  //     tileWorld.w *= u_PixelsPerMeter.z;
  //   }
  //   gl_Position = u_ViewProjectionMatrix * tileWorld + u_ViewportCenterProjection;
  // }

  setPickingColor(a_PickingColor);
}
