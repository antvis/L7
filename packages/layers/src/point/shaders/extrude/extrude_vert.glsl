#define pi (3.1415926535)

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec3 a_Size;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec4 a_Extrude;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;

layout(std140) uniform commonUniforms {
  float u_pickLight;
  float u_heightfixed;
  float u_r;
  float u_linearColor;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_opacitylinear;
  float u_opacitylinear_dir;
  float u_lightEnable;
};
out vec4 v_color;
out float v_lightWeight;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

float getYRadian(float x, float z) {
  if (x > 0.0 && z > 0.0) {
    return atan(x / z);
  } else if (x > 0.0 && z <= 0.0) {
    return atan(-z / x) + pi / 2.0;
  } else if (x <= 0.0 && z <= 0.0) {
    return pi + atan(x / z); //atan(x/z) +
  } else {
    return atan(z / -x) + pi * 3.0 / 2.0;
  }
}

float getXRadian(float y, float r) {
  return atan(y / r);
}

void main() {
  vec3 size = a_Size * a_Position;

  vec3 offset = size; // 控制圆柱体的大小 - 从标准单位圆柱体进行偏移

  if (u_heightfixed < 1.0) {
    // 圆柱体不固定高度
  } else {
    // 圆柱体固定高度 （ 处理 mapbox ）
    if (
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
    ) {
      offset *= 4.0 / pow(2.0, 21.0 - u_Zoom);
    }
  }

  vec2 positions = a_Extrude.xy;
  vec2 positions64Low = a_Extrude.zw;
  vec4 project_pos = project_position(vec4(positions, 0.0, 1.0), positions64Low);

  // u_r 控制圆柱的生长
  vec4 pos = vec4(project_pos.xy + offset.xy, offset.z * u_r, 1.0);

  // // 圆柱光照效果
  float lightWeight = 1.0;

  if (u_lightEnable > 0.0) {
    // 取消三元表达式，增强健壮性
    lightWeight = calc_lighting(pos);
  }

  v_lightWeight = lightWeight;

  v_color = a_Color;

  // 设置圆柱的底色
  if (u_linearColor == 1.0) {
    // 使用渐变颜色
    v_color = mix(u_sourceColor, u_targetColor, a_Position.z);
    v_color.a = v_color.a * opacity;
  } else {
    v_color = vec4(a_Color.rgb * lightWeight, a_Color.w * opacity);
  }

  if (u_opacitylinear > 0.0) {
    v_color.a *= u_opacitylinear_dir > 0.0 ? 1.0 - a_Position.z : a_Position.z;
  }

  gl_Position = project_common_position_to_clipspace(pos);

  setPickingColor(a_PickingColor);
}
