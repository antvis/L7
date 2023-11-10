attribute vec4 a_Color;
attribute vec2 a_Size;
attribute vec4 a_Instance;
attribute vec3 a_Normal;
attribute vec3 a_Position;

uniform mat4 u_ModelMatrix;


#pragma include "projection"
#pragma include "project"
#pragma include "picking"
varying vec4 v_color;
uniform float u_gap_width: 1.0;
uniform float u_stroke_width: 1.0;
uniform float u_stroke_opacity: 1.0;

vec2 project_pixel_offset(vec2 offsets) {

   vec2 data = project_pixel(offsets);
   if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
    // P20_2 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减3
    return data;
  }

  return vec2(data.x, -data.y);;
}

vec2 line_dir(vec2 target, vec2 source) {

   if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
    // P20_2 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减3
     return normalize(target - source);
  }
  return normalize(ProjectFlat(target) - ProjectFlat(source));
}

float flag_gap() {
   if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
    // P20_2 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减3
     return 1.;
  }
  return -1.;

}


void main() {

// 透明度计算
  vec2 source = a_Instance.rg;  // 起始点
  vec2 target =  a_Instance.ba; // 终点
  vec2 flowlineDir = line_dir(target,source);
  vec2 perpendicularDir = vec2(flowlineDir.y, flowlineDir.x); // mapbox || 高德


  vec2 position = mix(source, target, a_Position.x);
  
  float lengthCommon = length(project_position(vec4(target,0,1)) - project_position(vec4(source,0,1)));  //    
  vec2 offsetDistances = a_Size.x * project_pixel_offset(vec2(a_Position.y, a_Position.z)); // Mapbox || 高德
  vec2 limitedOffsetDistances = clamp(   
   offsetDistances,
   project_pixel(-lengthCommon*.2), project_pixel(lengthCommon*.2)
  );


  float startOffsetCommon = project_pixel(offsets[0]);
  float endOffsetCommon = project_pixel(offsets[1]);
  float endpointOffset = mix(
    clamp(startOffsetCommon, 0.0, lengthCommon*.2),
    -clamp(endOffsetCommon, 0.0, lengthCommon*.2),
    a_Position.x
  );

  vec2 normalsCommon =  u_stroke_width * project_pixel_offset(vec2(a_Normal.x, a_Normal.y)); // mapbox || 高德

  float gapCommon = flag_gap() * project_pixel(u_gap_width);
  vec3 offsetCommon = vec3(
    flowlineDir * (limitedOffsetDistances[1] + normalsCommon.y + endpointOffset * 1.05) -
    perpendicularDir * (limitedOffsetDistances[0] + gapCommon + normalsCommon.x),
    0.0
  );


  vec4 project_pos = project_position(vec4(position.xy, 0, 1.0));

  vec4 fillColor = vec4(a_Color.rgb, a_Color.a * opacity);
  v_color = mix(fillColor, vec4(u_stroke.xyz, u_stroke.w * fillColor.w * u_stroke_opacity), a_Normal.z);

  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xy + offsetCommon.xy, 0., 1.0));



  setPickingColor(a_PickingColor);
}
