layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 10) in vec3 a_Pos;

layout(std140) uniform commonUniforms {
    vec2 u_radius;
    float u_opacity;
    float u_coverage;
    float u_angle;
};


out vec4 v_color;


#pragma include "projection"
#pragma include "project"
#pragma include "picking"

void main() {
  v_color = a_Color;
  v_color.a *= u_opacity;

  mat2 rotationMatrix = mat2(cos(u_angle), sin(u_angle), -sin(u_angle), cos(u_angle));
  vec2 offset = a_Position.xy * u_radius * rotationMatrix * u_coverage ;
  // vec2 lnglat = unProjectFlat(a_Pos.xy + offset);
  // vec4 project_pos = project_position(vec4(lnglat, 0, 1.0));
  // gl_Position = project_common_position_to_clipspace(project_pos);

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    vec2 lnglat = unProjectFlat(a_Pos.xy + offset);
    vec2 customLnglat = customProject(lnglat) - u_sceneCenterMercator; // 将经纬度转换为高德2.0需要的平面坐标
    vec4 project_pos = project_position(vec4(customLnglat, 0, 1.0));
    gl_Position = u_Mvp * (project_pos);
  } else {
     vec2 lnglat = unProjectFlat(a_Pos.xy + offset);
    vec4 project_pos = project_position(vec4(lnglat, 0, 1.0));
    gl_Position = project_common_position_to_clipspace(project_pos);
  }

  setPickingColor(a_PickingColor);
}
