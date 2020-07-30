#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0

attribute float a_Miter;
attribute vec4 a_Color;
attribute vec2 a_Size;
attribute vec3 a_Normal;
attribute vec3 a_Position;

// dash line
attribute float a_Total_Distance;
attribute float a_Distance;

uniform mat4 u_ModelMatrix;
uniform float u_line_type: 0.0;
uniform vec4 u_dash_array: [10.0, 5.，0, 0];
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];

#pragma include "projection"
#pragma include "picking"

varying vec4 v_color;
varying vec4 v_dash_array;
varying vec2 v_normal;
varying float v_distance_ratio;
varying float v_side;


void main() {

  if(u_line_type == LineTypeDash) {
    v_distance_ratio = a_Distance / a_Total_Distance;
    v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / a_Total_Distance;
  }
  if(u_aimate.x == Animate) {
      v_distance_ratio = a_Distance / a_Total_Distance;
  }
  v_normal = vec2(reverse_offset_normal(a_Normal) * sign(a_Miter));
  v_color = a_Color;
  vec3 size = a_Miter * setPickingSize(a_Size.x) * reverse_offset_normal(a_Normal);
  vec2 offset = project_pixel(size.xy);
  v_side = a_Miter * a_Size.x;
  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, a_Size.y, 1.0));

  setPickingColor(a_PickingColor);
}
