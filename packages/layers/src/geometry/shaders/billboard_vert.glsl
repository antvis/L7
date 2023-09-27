precision highp float;
uniform mat4 u_ModelMatrix;
uniform float u_raisingHeight: 0.0;
uniform float u_opacity;
uniform vec2 u_size: [1.0, 1.0];
uniform mat2 u_RotateMatrix;

attribute vec3 a_Extrude;
attribute vec3 a_Position;
attribute vec2 a_Uv;
attribute vec3 a_Color;

varying vec3 v_Color;
varying vec2 v_uv;

#pragma include "projection"
#pragma include "picking"
void main() {
   vec3 extrude = a_Extrude;
   v_Color = a_Color;
   v_uv = a_Uv;

   float raiseHeight = u_raisingHeight;
   if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
      raiseHeight = u_raisingHeight * mapboxZoomScale;
   }

   // 计算经纬度点位坐标
   vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

   // 计算绕 z 轴旋转后的偏移
   vec2 offsetXY = project_pixel(u_RotateMatrix * vec2(extrude.x * u_size.x, 0.0));
   // 绕 z 轴旋转
   float x = project_pos.x + offsetXY.x;
   float y = project_pos.y + offsetXY.y;
   // z 轴不参与旋转
   float z = project_pixel(extrude.y * u_size.y + raiseHeight);

   gl_Position = project_common_position_to_clipspace_v2(vec4(x , y, z , 1.0));

   setPickingColor(a_PickingColor);
}
