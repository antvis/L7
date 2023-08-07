attribute vec4 a_Color;
attribute vec2 a_Size;
attribute vec4 a_Instance;
attribute vec3 a_Normal;
attribute vec3 a_Position;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

#pragma include "projection"
#pragma include "picking"
varying vec4 v_color;
uniform float u_gap_width: 1.0;
uniform float u_stroke_width: 1.0;
uniform float u_stroke_opacity: 1.0;


void main() {

// #ifdef USE_ATTRIBUTE_OPACITY
//   float opacity  = a_Opacity;
// #else
//   float opacity = u_opacity;
// #endif


// #ifdef USE_ATTRIBUTE_OFFSETS
//   vec2 offsets  = a_Offsets;
// #else
//   vec2 offsets = u_offsets;
// #endif

  // float opacity = u_opacity;
// 透明度计算
  vec2 source = a_Instance.rg;  // 起始点
  vec2 target =  a_Instance.ba; // 终点
  vec2 flowlineDir = normalize(target - source);
  vec2 perpendicularDir = vec2(-flowlineDir.y, flowlineDir.x);


  vec2 position = mix(source, target, a_Position.x);

  float lengthCommon = length(target - source);    
  vec2 offsetDistances = a_Size.x * project_pixel(a_Position.yz);
  vec2 limitedOffsetDistances = clamp(   
   offsetDistances,
    -lengthCommon*.8, lengthCommon*.8
  );

  float startOffsetCommon = project_pixel(offsets[0]);
  float endOffsetCommon = project_pixel(offsets[1]);
  float endpointOffset = mix(
    clamp(startOffsetCommon, 0.0, lengthCommon*.2),
    -clamp(endOffsetCommon, 0.0, lengthCommon*.2),
    a_Position.x
  );

  vec2 normalsCommon =  u_stroke_width * project_pixel(a_Normal.xy);

  float gapCommon =  project_pixel(u_gap_width);
  vec3 offsetCommon = vec3(
    flowlineDir * (limitedOffsetDistances[1] + normalsCommon.y + endpointOffset * 1.05) -
    perpendicularDir * (limitedOffsetDistances[0] + gapCommon + normalsCommon.x),
    0.0
  );


  vec4 project_pos = project_position(vec4(position.xy, 0, 1.0));

  vec4 fillColor = vec4(a_Color.rgb, a_Color.a * opacity);
  v_color = mix(fillColor, vec4(u_stroke.xyz, u_stroke.w * fillColor.w * u_stroke_opacity), a_Normal.z);


  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(project_pos.xy + offsetCommon.xy, 0., 1.0);
  } else {
     gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offsetCommon.xy, 0., 1.0));
  }



  setPickingColor(a_PickingColor);
}
