layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_SHAPE) in float a_Shape;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec3 a_Extrude;

layout(std140) uniform commonUniform {
  float u_additive;
  float u_stroke_opacity : 1;
  float u_stroke_width : 2;
  float u_blur : 0.0;
};
out vec4 v_data;
out vec4 v_color;
out float v_radius;

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
    // top-right, right, bottom-right -> shift left
    offset.x = -1.0;
  } else if (anchor == 6.0 || anchor == 7.0 || anchor == 8.0) {
    // bottom-left, left, top-left -> shift right
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
  vec3 extrude = a_Extrude;
  float shape_type = a_Shape;
  /*
  *  setPickingSize 设置拾取大小
  */
  float newSize = setPickingSize(a_Size);
  // float newSize = setPickingSize(a_Size) * 0.00001038445708445579;

  // unpack color(vec2)
  v_color = a_Color;

  // radius(16-bit)
  v_radius = newSize;

  // anti-alias
  //  float antialiased_blur = -max(u_blur, antialiasblur);
  float antialiasblur = -max(2.0 / u_DevicePixelRatio / newSize, u_blur);

  // apply anchor to extrude direction
  vec2 anchoredExtrude = applyAnchor(extrude.xy, anchor);

  // TODP: sign() 是为了兼容地球模式，同时避免 anchor 偏移后为 0 时除以零产生 NaN
  // 注意：v_data 必须使用原始 extrude 而非 anchoredExtrude，因为 SDF 形状计算需要基于原始形状坐标系
  // anchoredExtrude 只用于位置偏移，不改变形状本身的 SDF 采样
  v_data = vec4(sign(extrude.x), sign(extrude.y), antialiasblur,shape_type);

  gl_Position = u_ViewProjectionMatrix * vec4(a_Position + anchoredExtrude * newSize * 0.1 + vec3(offsets,0.0), 1.0);

  setPickingColor(a_PickingColor);
}
