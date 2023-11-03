
#define Animate 0.0

attribute float a_Miter;
attribute vec4 a_Color;
attribute vec2 a_Size;
attribute vec3 a_Normal;
attribute vec3 a_Position;

attribute vec2 a_iconMapUV;

// dash line
attribute float a_Total_Distance;
attribute vec2 a_DistanceAndIndex;

uniform mat4 u_ModelMatrix;

uniform vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
uniform float u_icon_step: 100;

uniform float u_heightfixed: 0.0;
uniform float u_vertexScale: 1.0;
uniform float u_raisingHeight: 0.0;

#pragma include "projection"
#pragma include "picking"

varying vec4 v_color;
varying vec4 v_stroke;

// texV 线图层 - 贴图部分的 v 坐标（线的宽度方向）
varying vec2 v_iconMapUV;


uniform float u_linearColor: 0;
uniform float u_arrow: 0.0;
uniform float u_arrowHeight: 3.0;
uniform float u_arrowWidth: 2.0;
uniform float u_tailWidth: 1.0;

varying vec4 v_texture_data;

vec2 calculateArrow(vec2 offset) {
  /*
  * 在支持箭头的时候，第二、第三组顶点是额外插入用于构建顶点的
  */
  float arrowFlag = -1.0;
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
    // 高德 2.0 的旋转角度不同
    arrowFlag = 1.0;
  }
  float pi = arrowFlag * 3.1415926/2.;
  if(a_Miter < 0.) {
    // 根据线的两侧偏移不同、旋转的方向相反
    pi = -pi;
  }
  highp float angle_sin = sin(pi);
  highp float angle_cos = cos(pi);
  // 计算垂直与线方向的旋转矩阵
  mat2 rotation_matrix = mat2(angle_cos, -1.0 * angle_sin, angle_sin, angle_cos);
  float arrowWidth = u_arrowWidth;
  float arrowHeight = u_arrowHeight;

  vec2 arrowOffset = vec2(0.0);
  /*
  * a_DistanceAndIndex.y 用于标记当前顶点属于哪一组（两个顶点一组，构成线的其实是矩形，最简需要四个顶点、两组顶点构成）
  */
  if(a_DistanceAndIndex.y == 0.0) {
    // 箭头尖部
    offset = vec2(0.0);
  } else if(a_DistanceAndIndex.y == 1.0) {
    // 箭头两侧
    arrowOffset = rotation_matrix*(offset * arrowHeight);
    offset += arrowOffset; // 沿线偏移
    offset = offset * arrowWidth; // 垂直线向外偏移（是构建箭头两侧的顶点）
  } else if(a_DistanceAndIndex.y == 2.0 || a_DistanceAndIndex.y == 3.0 || a_DistanceAndIndex.y == 4.0) {
    // 偏移其余的点位（将长度让位给箭头）
    arrowOffset = rotation_matrix*(offset * arrowHeight) * arrowWidth;
    offset += arrowOffset;// 沿线偏移
  }

  return offset;
}

void main() {
  // cal style mapping - 数据纹理映射部分的计算

  
  float d_texPixelLen;    // 贴图的像素长度，根据地图层级缩放

  v_iconMapUV = a_iconMapUV;
  d_texPixelLen = project_float_pixel(u_icon_step);
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
    d_texPixelLen *= 10.0;
  }

  v_color = a_Color;
  v_color.a *= opacity;
  v_stroke = stroke;

  vec3 size = a_Miter * setPickingSize(a_Size.x) * reverse_offset_normal(a_Normal);
  
  vec2 offset = project_pixel(size.xy);

  float lineDistance = a_DistanceAndIndex.x;
  float currentLinePointRatio = lineDistance / a_Total_Distance;
 
  if(u_arrow > 0.0) {
      //  计算箭头
    offset = calculateArrow(offset);

    if(a_DistanceAndIndex.y > 4.0) {
      offset *= mix(1.0, u_tailWidth, currentLinePointRatio);
    }
  }

  float lineOffsetWidth = length(offset + offset * sign(a_Miter)); // 线横向偏移的距离（向两侧偏移的和）
  float linePixelSize = project_pixel(a_Size.x) * 2.0;  // 定点位置偏移，按地图等级缩放后的距离 单侧 * 2
  float texV = lineOffsetWidth/linePixelSize; // 线图层贴图部分的 v 坐标值
  
  v_texture_data = vec4(currentLinePointRatio, lineDistance, d_texPixelLen, texV);
  // 设置数据集的参数

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
