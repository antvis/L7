attribute vec4 a_Color;
attribute vec3 a_Position;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

uniform float u_opacity: 1.0;

uniform vec2 u_tileOrigin;
uniform float u_coord;

varying vec4 v_Color;
varying mat4 styleMappingMat; // 用于将在顶点着色器中计算好的样式值传递给片元

#pragma include "styleMapping"
#pragma include "styleMappingCalOpacity"

#pragma include "projection"
#pragma include "picking"

void main() {
  // cal style mapping - 数据纹理映射部分的计算
styleMappingMat = mat4(
    0.0, 0.0, 0.0, 0.0, // opacity - strokeOpacity - strokeWidth - empty
    0.0, 0.0, 0.0, 0.0, // strokeR - strokeG - strokeB - strokeA
    0.0, 0.0, 0.0, 0.0, // offsets[0] - offsets[1]
    0.0, 0.0, 0.0, 0.0
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

  v_Color = a_Color;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));


  if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
    float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
    project_pos.z *= mapboxZoomScale;
  }

if(u_coord > 0.0) {
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * (vec4(project_pos.xyz, 1.0));
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
  }
} else {
    vec2 pointPos = a_Position.xy;
    vec4 world = vec4(project_mvt_offset_position(vec4(u_tileOrigin, 0.0, 1.0)).xyz, 1.0); // 瓦片起始点的世界坐标

    vec2 pointOffset =  pointPos *  pow(2.0, u_Zoom); // 瓦片内的点的偏移坐标
    
    world.xy += pointOffset;

    if (u_CoordinateSystem == COORDINATE_SYSTEM_METER_OFFSET || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      // Needs to be divided with project_uCommonUnitsPerMeter
      world.w *= u_PixelsPerMeter.z;
    }

    gl_Position = u_ViewProjectionMatrix * world + u_ViewportCenterProjection;
}


  setPickingColor(a_PickingColor);
}

