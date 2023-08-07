#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0

attribute float a_Miter;
attribute vec4 a_Color;
attribute vec2 a_Size;
attribute vec3 a_Normal;
attribute vec3 a_Position;

attribute vec2 a_iconMapUV;

// dash line
attribute float a_Total_Distance;
attribute vec2 a_DistanceAndIndex;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform vec4 u_dash_array: [10.0, 5., 0, 0];

uniform float u_vertexScale: 1.0;

#pragma include "projection"
#pragma include "picking"

varying vec4 v_color;
varying vec4 v_dash_array;
varying float v_d_distance_ratio;


void main() {

  v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / a_Total_Distance;
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);

  vec3 size = a_Miter * setPickingSize(a_Size.x) * reverse_offset_normal(a_Normal);
  vec2 offset = project_pixel(size.xy);
  v_d_distance_ratio = a_DistanceAndIndex.x / a_Total_Distance;


  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));

  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, a_Size.y, 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * (vec4(project_pos.xy + offset, project_pixel(a_Size.y), 1.0));
  } else {
    float lineHeight = a_Size.y;
 
    // #define COORDINATE_SYSTEM_P20 5.0
    // #define COORDINATE_SYSTEM_P20_OFFSET 6.0
    // amap1.x
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20 || u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) {
      // 保持高度相对不变
      lineHeight *= pow(2.0, 20.0 - u_Zoom);
    }

    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, lineHeight, 1.0));
  }

  setPickingColor(a_PickingColor);
}
