attribute float a_Miter;
attribute vec4 a_Color;
attribute vec2 a_Size;
attribute vec3 a_Normal;
attribute vec3 a_Position;

// dash line
attribute vec4 a_dirPoints;
attribute vec3 a_DistanceAndIndex;

uniform vec4 u_lineDir;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

#pragma include "projection"
#pragma include "picking"

varying vec4 v_color;

uniform float u_linearColor: 0;
uniform float u_arrow: 0.0;
uniform float u_arrowHeight: 3.0;
uniform float u_arrowWidth: 2.0;
uniform float u_tailWidth: 1.0;

uniform float u_opacity: 1.0;
varying mat4 styleMappingMat; // 用于将在顶点着色器中计算好的样式值传递给片元

#pragma include "styleMapping"
#pragma include "styleMappingCalOpacity"

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
  styleMappingMat = mat4(
    0.0, 0.0, 0.0, 0.0, // opacity - strokeOpacity - a_Miter - a_DistanceAndIndex
    0.0, 0.0, 0.0, 0.0, // originX - originY - vectorX - vectorY
    0.0, 0.0, 0.0, 0.0, // offsets[0] - offsets[1]
    0.0, 0.0, 0.0, 0.0  // distance_ratio/distance/pixelLen/texV
  );
  styleMappingMat[0][3] = a_DistanceAndIndex.y;
  styleMappingMat[0][2] = a_Miter;

  float rowCount = u_cellTypeLayout[0][0];    // 当前的数据纹理有几行
  float columnCount = u_cellTypeLayout[0][1]; // 当看到数据纹理有几列
  float columnWidth = 1.0/columnCount;  // 列宽
  float rowHeight = 1.0/rowCount;       // 行高
  float cellCount = calCellCount(); // opacity - strokeOpacity - strokeWidth - stroke - offsets
  float id = a_vertexId; // 第n个顶点
  float cellCurrentRow = floor(id * cellCount / columnCount) + 1.0; // 起始点在第几行
  float cellCurrentColumn = mod(id * cellCount, columnCount) + 1.0; // 起始点在第几列
  
  // cell 固定顺序 opacity -> strokeOpacity -> strokeWidth -> stroke ... 
  // 按顺序从 cell 中取值、若没有则自动往下取值
  float textureOffset = 0.0; // 在 cell 中取值的偏移量

  vec2 opacityAndOffset = calOpacityAndOffset(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset, columnWidth, rowHeight);
  styleMappingMat[0][0] = opacityAndOffset.r;
  textureOffset = opacityAndOffset.g;
  // cal style mapping - 数据纹理映射部分的计算


  v_color = a_Color;

  vec3 size = a_Miter * setPickingSize(a_Size.x) * reverse_offset_normal(a_Normal);
  
  vec2 offset = project_pixel(size.xy);

  // styleMappingMat[1].rg = a_Position.xy + offset;

  vec2 copyOffset = vec2(offset.x, offset.y);

  float lineDistance = a_DistanceAndIndex.x;
  float total_Distance = a_DistanceAndIndex.z;
  float currentLinePointRatio = lineDistance / total_Distance;
 
  if(u_arrow > 0.0) {
      //  计算箭头
    offset = calculateArrow(offset);

    if(a_DistanceAndIndex.y > 4.0) {
      offset *= mix(1.0, u_tailWidth, currentLinePointRatio);
    }
  }

  float lineOffsetWidth = length(offset + offset * sign(a_Miter)); // 线横向偏移的距离（向两侧偏移的和）
  float linePixelSize = project_pixel(a_Size.x) * 2.0;  // 定点位置偏移，按地图等级缩放后的距离 单侧 * 2

  // 设置数据集的参数
  styleMappingMat[3][0] = currentLinePointRatio; // 当前点位距离占线总长的比例
  styleMappingMat[3][1] = lineDistance;       // 当前顶点的距离

  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));

  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, a_Size.y, 1.0));

  float h = float(a_Position.z); // 线顶点的高度 - 兼容不存在第三个数值的情况 vertex height
  float lineHeight = a_Size.y; // size 第二个参数代表的高度 [linewidth, lineheight]

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    lineHeight *= 0.2; // 保持和 amap/mapbox 一致的效果
    gl_Position = u_Mvp * (vec4(project_pos.xy + offset, lineHeight, 1.0));
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, lineHeight, 1.0));
  }
  
  if(u_arrow > 0.0 && a_DistanceAndIndex.y < 2.0) {
    vec2 startPoint = a_dirPoints.rg;
    vec2 endPoint = a_dirPoints.ba;
    vec4 t1 = project_position(vec4(startPoint, 0, 1.0));
    vec4 t2 = project_position(vec4(endPoint, 0, 1.0));
    // TODO： 后续优化可以把位置计算放在 cpu 中完成
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
      vec2 p1 = (u_Mvp * vec4(t1.xy, 0.0, 1.0)).xy;
      vec2 p2 = (u_Mvp * vec4(t2.xy, 0.0, 1.0)).xy;
      styleMappingMat[1].rg = normalize(p1 - p2);
      styleMappingMat[1].ba = normalize(gl_Position.xy - p2);
    } else {
      vec2 p1 = project_common_position_to_clipspace(vec4(t1.xy, 0.0, 1.0)).xy;
      vec2 p2 = project_common_position_to_clipspace(vec4(t2.xy, 0.0, 1.0)).xy;
      styleMappingMat[1].rg = normalize(p1 - p2);
      styleMappingMat[1].ba = normalize(gl_Position.xy - p2);
    }
  }

  setPickingColor(a_PickingColor);
}
