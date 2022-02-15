
attribute vec4 a_Color;
attribute vec2 a_Size;
attribute vec3 a_Position;


// dash line
attribute float a_Total_Distance;
attribute float a_Distance;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

uniform float u_opacity: 1.0;
uniform float u_vertexScale: 1.0;

#pragma include "projection"

varying vec4 v_color;

varying mat4 styleMappingMat; // 用于将在顶点着色器中计算好的样式值传递给片元

#pragma include "styleMapping"
#pragma include "styleMappingCalOpacity"

void main() {
  // cal style mapping - 数据纹理映射部分的计算
  styleMappingMat = mat4(
    0.0, 0.0, 0.0, 0.0, // opacity - strokeOpacity - strokeWidth - empty
    0.0, 0.0, 0.0, 0.0, // strokeR - strokeG - strokeB - strokeA
    0.0, 0.0, 0.0, 0.0, // offsets[0] - offsets[1]
    0.0, 0.0, 0.0, 0.0  // distance_ratio/distance/pixelLen/texV
  );

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

  float d_distance_ratio; // 当前点位距离占线总长的比例
  v_color = a_Color;  

  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));

  float h = float(a_Position.z) * u_vertexScale; // 线顶点的高度 - 兼容不存在第三个数值的情况

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * (vec4(project_pos.xy, project_pixel(a_Size.y) + h * 0.2, 1.0));
  } else {
    float lineHeight = a_Size.y;
    // 兼容 mapbox 在线高度上的效果表现基本一致
    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      // 保持高度相对不变
      h *= 2.0/pow(2.0, 20.0 - u_Zoom);
    }

    // #define COORDINATE_SYSTEM_P20 5.0
    // #define COORDINATE_SYSTEM_P20_OFFSET 6.0
    // amap1.x
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20 || u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) {
      // 保持高度相对不变
      lineHeight *= pow(2.0, 20.0 - u_Zoom);
    }

    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, lineHeight + h, 1.0));
  }
}
