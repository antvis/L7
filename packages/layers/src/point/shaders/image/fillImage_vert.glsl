attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Extrude;
attribute float a_Size;
attribute vec2 a_Uv;
attribute float a_Rotate;

varying mat4 styleMappingMat; // 用于将在顶点着色器中计算好的样式值传递给片元

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform mat2 u_RotateMatrix;
uniform float u_isMeter;

varying vec2 v_uv; // 本身的 uv 坐标
varying vec2 v_Iconuv; // icon 贴图的 uv 坐标

uniform float u_opacity : 1;
uniform vec2 u_offsets;

#pragma include "styleMapping"
#pragma include "styleMappingCalOpacity"

#pragma include "projection"
#pragma include "picking"

void main() {
  vec3 extrude = a_Extrude;

  v_uv = (a_Extrude.xy + 1.0)/2.0;
  v_uv.y = 1.0 - v_uv.y;
  v_Iconuv = a_Uv;

  // cal style mapping - 数据纹理映射部分的计算
  styleMappingMat = mat4(
    0.0, 0.0, 0.0, 0.0, // opacity - empty - empty - empty
    0.0, 0.0, 0.0, 0.0, // empty - empty - empty - empty
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

  vec2 textrueOffsets = vec2(0.0, 0.0);
  if(hasOffsets()) {
    vec2 valueXPos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    textrueOffsets.r = pos2value(valueXPos, columnWidth, rowHeight); // x
    textureOffset += 1.0;

    vec2 valueYPos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    textrueOffsets.g = pos2value(valueYPos, columnWidth, rowHeight); // x
    textureOffset += 1.0;
  } else {
    textrueOffsets = u_offsets;
  }

  // cal style mapping

  highp float angle_sin = sin(a_Rotate);
  highp float angle_cos = cos(a_Rotate);
  mat2 rotation_matrix = mat2(angle_cos, -1.0 * angle_sin, angle_sin, angle_cos);

  // vec2 offset = (u_RotateMatrix * extrude.xy * (a_Size) + textrueOffsets);
  vec2 offset = (rotation_matrix * u_RotateMatrix * extrude.xy * (a_Size) + textrueOffsets);
  vec3 aPosition = a_Position;
  if(u_isMeter < 1.0) {
    // 不以米为实际单位
    offset = project_pixel(offset);
  } else {
    // 以米为实际单位

    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      aPosition.xy += offset;
      offset.x = 0.0;
      offset.y = 0.0;
    }
  }


  // vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));
  vec4 project_pos = project_position(vec4(aPosition.xy, 0.0, 1.0));
  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(project_pos.xy + offset, 0.0, 1.0);
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));
  }
 
  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

  setPickingColor(a_PickingColor);
}
