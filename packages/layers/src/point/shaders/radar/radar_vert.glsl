layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec3 a_Extrude;

layout(std140) uniform commonUniorm {
  float u_additive;
  float u_size_unit;
  float u_speed: 1.0;
  float u_time;
};

out vec4 v_data;
out vec4 v_color;
out float v_radius;
out vec2 v_extrude;

#pragma include "projection"
#pragma include "picking"

// 根据 anchor 值计算 extrude 偏移
// anchor: 0=center, 1=top, 2=top-right, 3=right, 4=bottom-right, 5=bottom, 6=bottom-left, 7=left, 8=top-left, 9=bottom-center
vec2 applyAnchor(vec2 extrude, float anchor) {
  if (anchor < 0.5) {
    return extrude;
  }

  vec2 offset = vec2(0.0);

  // horizontal alignment: 左边缘对准坐标 -> 向右移; 右边缘对准坐标 -> 向左移
  if (anchor == 2.0 || anchor == 3.0 || anchor == 4.0) {
    offset.x = -1.0;
  } else if (anchor == 6.0 || anchor == 7.0 || anchor == 8.0) {
    offset.x = 1.0;
  }

  // vertical alignment: 上边缘对准坐标 -> 向下移(图形在坐标下方); 下边缘对准坐标 -> 向上移(图形在坐标上方)
  if (anchor == 1.0 || anchor == 2.0 || anchor == 8.0) {
    // top, top-right, top-left -> shift down
    offset.y = -1.0;
  } else if (anchor == 4.0 || anchor == 5.0 || anchor == 6.0 || anchor == 9.0) {
    // bottom-right, bottom, bottom-left, bottom-center -> shift up
    offset.y = 1.0;
  }

  return extrude + offset;
}

void main() {
  float newSize = setPickingSize(a_Size);

  float time = u_time * u_speed;
  mat2 rotateMatrix = mat2(
    cos(time), sin(time),
    -sin(time), cos(time)
  );

  // apply anchor to extrude direction before rotation
  vec2 anchoredExtrude = applyAnchor(a_Extrude.xy, anchor);
  v_extrude = rotateMatrix * anchoredExtrude;

  v_color = a_Color;
  v_color.a *= opacity;

  float blur = 0.0;
  float antialiasblur = -max(2.0 / u_DevicePixelRatio / a_Size, blur);

  if(u_size_unit == 1.) {
    newSize = newSize  * u_PixelsPerMeter.z;
  }
  v_radius = newSize;

  vec2 offset = (anchoredExtrude * (newSize));

  offset = project_pixel(offset);

  v_data = vec4(anchoredExtrude.x, anchoredExtrude.y, antialiasblur, -1.0);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));

  setPickingColor(a_PickingColor);
}
