
// 多边形顶点坐标
layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 9) in float a_Size;
// 多边形经纬度坐标
layout(location = 11) in vec3 a_Pos;
layout(location = 13) in vec3 a_Normal;

layout(std140) uniform commonUniforms {
  vec2 u_radius;
  float u_coverage: 0.9;
  float u_angle: 0;
};

out vec4 v_color;
out float v_opacity;

#pragma include "projection"
#pragma include "project"
#pragma include "light"
#pragma include "picking"


void main() {
  mat2 rotationMatrix = mat2(cos(u_angle), sin(u_angle), -sin(u_angle), cos(u_angle));
  vec2 offset =(vec2(a_Position.xy * u_radius * rotationMatrix * u_coverage));
   v_opacity=opacity;

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
 
    vec2 lnglat = unProjectFlat(a_Pos.xy + offset); // 经纬度
    vec2 customLnglat = customProject(lnglat) - u_sceneCenterMercator; // 将经纬度转换为高德2.0需要的平面坐标
    vec4 project_pos = project_position(vec4(customLnglat, a_Position.z * a_Size, 1.0));

    float lightWeight = calc_lighting(project_pos);
    v_color =vec4(a_Color.rgb*lightWeight, a_Color.w);
  
    gl_Position = u_Mvp * vec4(customLnglat , a_Position.z * a_Size, 1.0);
  } else {
    vec2 lnglat = unProjectFlat(a_Pos.xy + offset); // 实际的经纬度
    vec4 project_pos = project_position(vec4(lnglat, a_Position.z * a_Size, 1.0));
    
    float lightWeight = calc_lighting(project_pos);
    v_color =vec4(a_Color.rgb*lightWeight, a_Color.w);
    
    gl_Position = project_common_position_to_clipspace(project_pos);
  }



  setPickingColor(a_PickingColor);
}
