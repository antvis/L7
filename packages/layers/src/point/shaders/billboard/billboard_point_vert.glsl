
layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;

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

// 根据 anchor 值计算点精灵的像素偏移
// anchor: 0=center, 1=top, 2=top-right, 3=right, 4=bottom-right, 5=bottom, 6=bottom-left, 7=left, 8=top-left, 9=bottom-center
vec2 applyAnchorPoint(float anchor, float pointSize) {
  if (anchor < 0.5) {
    return vec2(0.0);
  }

  vec2 offset = vec2(0.0);
  float gap = 2.0 * u_DevicePixelRatio; // 2px 间隔，考虑设备像素比

  // horizontal alignment: 左边缘对准坐标 -> 向右移; 右边缘对准坐标 -> 向左移
  if (anchor == 2.0 || anchor == 3.0 || anchor == 4.0) {
    offset.x = -pointSize * 0.5;
  } else if (anchor == 6.0 || anchor == 7.0 || anchor == 8.0) {
    offset.x = pointSize * 0.5;
  }

  // vertical alignment: 上边缘对准坐标 -> 向下移(图形在坐标下方); 下边缘对准坐标 -> 向上移(图形在坐标上方)
  // bottom 和 top 增加 2px 间隔，避免图形紧贴参考点
  if (anchor == 1.0 || anchor == 2.0 || anchor == 8.0) {
    offset.y = -pointSize * 0.5 - gap; // top: 图形在坐标下方，额外向下移 2px
  } else if (anchor == 4.0 || anchor == 5.0 || anchor == 6.0 || anchor == 9.0) {
    offset.y = pointSize * 0.5 + gap; // bottom: 图形在坐标上方，额外向上移 2px
  }

  return offset;
}

void main() {
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);
  v_blur = 1.0 - max(2.0 / a_Size, 0.05);
  v_innerRadius = max((a_Size - u_stroke_width) / a_Size, 0.0);

  vec2 offset = project_pixel(offsets);

  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(vec4(vec2(project_pos.xy+offset),project_pos.z,project_pos.w));

  gl_PointSize = a_Size * 2.0 * u_DevicePixelRatio;

  // apply anchor offset in screen space
  vec2 anchorOffset = applyAnchorPoint(anchor, gl_PointSize);
  gl_Position.xy += anchorOffset / u_ViewportSize * 2.0 * gl_Position.w;

  setPickingColor(a_PickingColor);
}
