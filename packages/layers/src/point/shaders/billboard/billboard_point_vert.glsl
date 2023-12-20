
layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 9) in float a_Size;

layout(std140) uniform commonUniorm {
  vec4 u_stroke_color;
  float u_additive;
  float u_stroke_opacity;
  float u_stroke_width;
};

out vec4 v_color;
out float v_blur;
out float v_innerRadius;

#pragma include "projection"
#pragma include "picking"
#pragma include "project"
void main() {
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);
  v_blur = 1.0 - max(2.0/a_Size, 0.05);
  v_innerRadius = max((a_Size - u_stroke_width) / a_Size, 0.0);
  
  vec2 offset = project_pixel(u_offsets);
  
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(a_Position.xy + offset, a_Position.z, 1.0);
  } else { // else
    vec4 project_pos = project_position(vec4(a_Position, 1.0)) + vec4(a_Size / 2.,-a_Size /2.,0.,0.);
    gl_Position = project_common_position_to_clipspace(vec4(vec2(project_pos.xy+offset),project_pos.z,project_pos.w));
  }
  
  gl_PointSize = a_Size * 2.0 * u_DevicePixelRatio;
  setPickingColor(a_PickingColor);
}
