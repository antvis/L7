attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Extrude;
attribute float a_Size;
attribute float a_Shape;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform int u_size_unit;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;
varying vec4 v_stroke;

// uniform float u_opacity : 1;
uniform float u_stroke_width: 2;
uniform vec3 u_blur_height_fixed: [0, 0, 0];


#pragma include "projection"
#pragma include "picking"


void main() {
  // 透明度计算
  v_stroke = stroke;  
  vec3 extrude = a_Extrude;
  float shape_type = a_Shape;
  /*
  *  setPickingSize 设置拾取大小
  *  u_meter2coord 在等面积大小的时候设置单位
  */
  float newSize = setPickingSize(a_Size);
  // float newSize = setPickingSize(a_Size) * 0.00001038445708445579;



  // unpack color(vec2)
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);

  if(u_size_unit == 1) {
    newSize = newSize  * u_PixelsPerMeter.z;
  }

   v_radius = newSize;

  // anti-alias
  //  float antialiased_blur = -max(u_blur, antialiasblur);
  float antialiasblur = -max(2.0 / u_DevicePixelRatio / newSize, u_blur_height_fixed.x);

  vec2 offset = (extrude.xy * (newSize + u_stroke_width) + u_offsets);
  vec3 aPosition = a_Position;

  offset = project_pixel(offset);
  
  // TODP: /abs(extrude.x) 是为了兼容地球模式
  v_data = vec4(extrude.x/abs(extrude.x), extrude.y/abs(extrude.y), antialiasblur,shape_type);


  // vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));
  vec4 project_pos = project_position(vec4(aPosition.xy, 0.0, 1.0));
  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));

  float raisingHeight = u_blur_height_fixed.y;

  if(u_blur_height_fixed.z < 1.0) { // false
    raisingHeight = project_pixel(u_blur_height_fixed.y);
  } else {
     if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
      raisingHeight = u_blur_height_fixed.y * mapboxZoomScale;
    }
  }
 

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position =  u_Mvp * vec4(project_pos.xy + offset, raisingHeight, 1.0);
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, raisingHeight, 1.0));
  }
 
  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

  setPickingColor(a_PickingColor);
}
