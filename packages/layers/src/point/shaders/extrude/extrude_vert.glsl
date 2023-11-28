precision highp float;

#define pi 3.1415926535
#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec3 a_Position;
attribute vec3 a_Pos;
attribute vec4 a_Color;
attribute vec3 a_Size;
attribute vec3 a_Normal;

uniform float u_heightfixed: 0.0; // 默认不固定
uniform float u_r;
uniform mat4 u_ModelMatrix;

varying vec4 v_color;
varying float v_lightWeight;
varying float v_barLinearZ;

uniform float u_opacity : 1;
uniform float u_lightEnable: 1;
uniform float u_opacitylinear: 0.0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;
uniform float u_opacitylinear_dir: 1.0;
uniform float  u_linearColor: 0.0;


#pragma include "projection"
#pragma include "light"
#pragma include "picking"

float getYRadian(float x, float z) {
  if(x > 0.0 && z > 0.0) {
    return atan(x/z);
  } else if(x > 0.0 && z <= 0.0){
    return atan(-z/x) + pi/2.0;
  } else if(x <= 0.0 && z <= 0.0) {
    return  pi + atan(x/z); //atan(x/z) + 
  } else {
    return atan(z/-x) + pi*3.0/2.0;
  }
}

float getXRadian(float y, float r) {
  return atan(y/r);
}

void main() {


  vec3 size = a_Size * a_Position;

  vec3 offset = size; // 控制圆柱体的大小 - 从标准单位圆柱体进行偏移

  if(u_heightfixed < 1.0) { // 圆柱体不固定高度
    
    if (u_CoordinateSystem == COORDINATE_SYSTEM_P20 || u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) {
      // P20 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减1
      offset = offset * pow(2.0, (19.0 - u_Zoom));
    }
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
      // P20_2 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减3
      offset = offset * pow(2.0, (19.0 - 3.0 - u_Zoom));
    }
  } else {// 圆柱体固定高度 （ 处理 mapbox ）
    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      offset *= 4.0/pow(2.0, 21.0 - u_Zoom);
    }
  }


  vec4 project_pos = project_position(vec4(a_Pos.xy, 0., 1.0));

  // u_r 控制圆柱的生长
  vec4 pos = vec4(project_pos.xy + offset.xy, offset.z * u_r, 1.0);

  // // 圆柱光照效果
  float lightWeight = 1.0;

  if(u_lightEnable > 0.0) { // 取消三元表达式，增强健壮性
    lightWeight = calc_lighting(pos);
  }

  v_lightWeight = lightWeight;

  v_color = a_Color;

    // 设置圆柱的底色
  if(u_linearColor == 1.0) { // 使用渐变颜色
    v_color = mix(u_sourceColor, u_targetColor, a_Position.z);
    v_color.a =  v_color.a * u_opacity;
  } else {
    v_color = vec4(a_Color.rgb * lightWeight, a_Color.w * u_opacity);
  }

    if(u_opacitylinear > 0.0) {
    v_color.a *= u_opacitylinear_dir > 0.0 ? (1.0 - a_Position.z): a_Position.z;
  }


  gl_Position = project_common_position_to_clipspace_v2(pos);

  setPickingColor(a_PickingColor);
}
