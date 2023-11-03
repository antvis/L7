attribute vec4 a_Color;
attribute vec2 a_Size;
attribute vec3 a_Position;

attribute float a_Total_Distance;
attribute float a_Distance;

uniform mat4 u_ModelMatrix;


uniform float u_vertexScale: 1.0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;



#pragma include "projection"

varying vec4 v_color;
varying float v_distanceScale;

void main() {

  v_color = a_Color; 
  v_distanceScale = a_Distance / a_Total_Distance;
  v_color.a = v_color.a * opacity;
  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));

  float h = float(a_Position.z) * u_vertexScale; // 线顶点的高度 - 兼容不存在第三个数值的情况

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * (vec4(project_pos.xy, project_pixel(a_Size.y) + h * 0.2, 1.0));
  } else {
    float lineHeight = a_Size.y;
    // 兼容 mapbox 在线高度上的效果表现基本一致
    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      // 保持高度相对不变
      h *= 2.0/pow(2.0, 20.0 - u_Zoom);
    }

    // amap1.x
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20 || u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) {
      // 保持高度相对不变
      lineHeight *= pow(2.0, 20.0 - u_Zoom);
    }

    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, lineHeight + h, 1.0));
    gl_PointSize = 10.0;
  }
}
