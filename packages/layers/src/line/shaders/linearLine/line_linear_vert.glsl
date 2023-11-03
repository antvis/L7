
attribute float a_Miter;
attribute vec2 a_Size;
attribute vec3 a_Normal;
attribute vec3 a_Position;

// dash line
attribute float a_Total_Distance;
attribute vec2 a_DistanceAndIndex;

uniform mat4 u_ModelMatrix;


uniform float u_heightfixed: 0.0;
uniform float u_vertexScale: 1.0;
uniform float u_raisingHeight: 0.0;
uniform sampler2D u_texture;
uniform float u_linearDir: 1.0;
varying vec4 v_Color;


#pragma include "projection"
#pragma include "picking"


void main() {


  vec3 size = a_Miter * setPickingSize(a_Size.x) * reverse_offset_normal(a_Normal);
  
  vec2 offset = project_pixel(size.xy);

  float lineDistance = a_DistanceAndIndex.x;
  float currentLinePointRatio = lineDistance / a_Total_Distance;
 

  float lineOffsetWidth = length(offset + offset * sign(a_Miter)); // 线横向偏移的距离（向两侧偏移的和）
  float linePixelSize = project_pixel(a_Size.x) * 2.0;  // 定点位置偏移，按地图等级缩放后的距离 单侧 * 2
  float texV = lineOffsetWidth/linePixelSize; // 线图层贴图部分的 v 坐标值

  float linearRadio =currentLinePointRatio; // 当前点位距离占线总长的比例
  if(u_linearDir < 1.0) {
    linearRadio = texV;
  }

  v_Color = texture2D(u_texture, vec2(linearRadio, 0.5));

  v_Color.a *= opacity; // 全局透明度



  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));

  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, a_Size.y, 1.0));

  float h = float(a_Position.z) * u_vertexScale; // 线顶点的高度 - 兼容不存在第三个数值的情况 vertex height
  float lineHeight = a_Size.y; // size 第二个参数代表的高度 [linewidth, lineheight]

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    lineHeight *= 0.2; // 保持和 amap/mapbox 一致的效果
    h *= 0.2;
    if(u_heightfixed < 1.0) {
      lineHeight = project_pixel(a_Size.y);
    }
    gl_Position = u_Mvp * (vec4(project_pos.xy + offset, lineHeight + h + u_raisingHeight, 1.0));
  } else {
    // mapbox -  amap
    
    // 兼容 mapbox 在线高度上的效果表现基本一致
    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      // mapbox
      // 保持高度相对不变
      float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
      h *= mapboxZoomScale;
      h += u_raisingHeight * mapboxZoomScale;
      if(u_heightfixed > 0.0) {
        lineHeight *= mapboxZoomScale;
      }
      
    } else {
      // amap
      h += u_raisingHeight;
      // lineHeight 顶点偏移高度
      if(u_heightfixed < 1.0) {
        lineHeight *= pow(2.0, 20.0 - u_Zoom);
      }
    }

    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, lineHeight + h, 1.0));
  }

  setPickingColor(a_PickingColor);
}
