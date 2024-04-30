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

  // TODP: /abs(extrude.x) 是为了兼容地球模式
  v_data = vec4(extrude.x/abs(extrude.x), extrude.y/abs(extrude.y), antialiasblur,shape_type);

  gl_Position = u_ViewProjectionMatrix * vec4(a_Position + extrude * newSize * 0.1 + vec3(u_offsets,0.0), 1.0);

  setPickingColor(a_PickingColor);
}
