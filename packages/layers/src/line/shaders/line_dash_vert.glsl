
attribute float a_Miter;
attribute vec4 a_Color;
attribute float a_Size;
attribute vec3 a_Normal;
attribute float a_Total_Distance;
attribute vec3 a_Position;
attribute float a_Distance;
uniform mat4 u_ModelMatrix;
uniform vec2 u_dash_array: [10.0, 5.];
uniform  float u_line_type: 0.0;
uniform float u_dash_offset: 0;

varying vec4 v_color;
varying vec2 v_dash_array;
varying vec2 v_normal;

varying float v_distance_ratio;



#pragma include "projection"
void main() {


  v_distance_ratio = a_Distance / a_Total_Distance;

  v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / a_Total_Distance;

  v_normal = vec2(reverse_offset_normal(a_Normal) * sign(a_Miter));
  v_color = a_Color;
  vec3 size = a_Miter * setPickingSize(a_Size) * reverse_offset_normal(a_Normal);  //v_normal * vec3(1., -1., 1.0);
  vec2 offset = project_pixel(size.xy);
  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0, 1.0));
}
