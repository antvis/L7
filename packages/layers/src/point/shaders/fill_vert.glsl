layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 9) in float a_Size;
layout(location = 10) in float a_Shape;
layout(location = 11) in vec3 a_Extrude;


out vec4 v_color;


#pragma include "projection"

void main() {
  // 透明度计算

  vec3 extrude = a_Extrude;
  v_color = a_Color;

  vec2 offset = (extrude.xy * 100.);
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
   
  offset = project_pixel(offsets);
  
  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xy + offset, 0., 1.0));

  // setPickingColor(a_PickingColor);
}
