#define SDF_PX 8.0
#define EDGE_GAMMA 0.105
#define FONT_SIZE 24.0
attribute vec3 a_Position;
attribute vec2 a_tex;
attribute vec2 a_textOffsets;
attribute vec4 a_Color;
attribute float a_Size;
attribute float a_Rotate;

uniform vec2 u_sdf_map_size;
uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform float u_raisingHeight: 0.0;

varying vec2 v_uv;
varying float v_gamma_scale;
varying vec4 v_color;
varying float v_fontScale;

varying mat4 styleMappingMat; // 用于将在顶点着色器中计算好的样式值传递给片元

uniform float u_opacity : 1;
uniform float u_stroke_width : 2;
uniform vec4 u_stroke_color : [0.0, 0.0, 0.0, 0.0];

#pragma include "styleMapping"
#pragma include "styleMappingCalOpacity"
#pragma include "styleMappingCalStrokeWidth"

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

   vec2 strokeWidthAndOffset = calStrokeWidthAndOffset(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset, columnWidth, rowHeight);
  styleMappingMat[0][2] = strokeWidthAndOffset.r;
  textureOffset = strokeWidthAndOffset.g;

  vec4 textrueStroke = vec4(-1.0, -1.0, -1.0, -1.0);
  if(hasStroke()) {
    vec2 valueRPos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    styleMappingMat[1][0] = pos2value(valueRPos, columnWidth, rowHeight); // R
    textureOffset += 1.0;

    vec2 valueGPos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    styleMappingMat[1][1] = pos2value(valueGPos, columnWidth, rowHeight); // G
    textureOffset += 1.0;

    vec2 valueBPos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    styleMappingMat[1][2] = pos2value(valueBPos, columnWidth, rowHeight); // B
    textureOffset += 1.0;

    vec2 valueAPos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    styleMappingMat[1][3] = pos2value(valueAPos, columnWidth, rowHeight); // A
    textureOffset += 1.0;
  } else {
    if(u_stroke_color == vec4(0.0)) {
      styleMappingMat[1][0] = v_color.r;
      styleMappingMat[1][1] = v_color.g;
      styleMappingMat[1][2] = v_color.b;
      styleMappingMat[1][3] = v_color.a;
    } else {
      styleMappingMat[1][0] = u_stroke_color.r;
      styleMappingMat[1][1] = u_stroke_color.g;
      styleMappingMat[1][2] = u_stroke_color.b;
      styleMappingMat[1][3] = u_stroke_color.a;
    }
  }
  
  // cal style mapping - 数据纹理映射部分的计算

  v_color = a_Color;
  v_uv = a_tex / u_sdf_map_size;

  // 文本缩放比例
  float fontScale = a_Size / FONT_SIZE;
  v_fontScale = fontScale;

  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  // vec4 projected_position  = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  highp float angle_sin = sin(a_Rotate);
  highp float angle_cos = cos(a_Rotate);
  mat2 rotation_matrix = mat2(angle_cos, -1.0 * angle_sin, angle_sin, angle_cos);
  
  // gl_Position = vec4(projected_position.xy / projected_position.w + rotation_matrix * a_textOffsets * fontScale / u_ViewportSize * 2.0 * u_DevicePixelRatio, 0.0, 1.0);

  float raiseHeight = u_raisingHeight;
  if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
    float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
    raiseHeight = u_raisingHeight * mapboxZoomScale;
  }

  vec4 projected_position;
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
   projected_position  = u_Mvp *(vec4(a_Position.xyz + vec3(0.0, 0.0, raiseHeight), 1.0));
  } else { // else
   projected_position  = project_common_position_to_clipspace(vec4(project_pos.xyz + vec3(0.0, 0.0, raiseHeight), 1.0));
  }

  gl_Position = vec4(
    projected_position.xy / projected_position.w + rotation_matrix * a_textOffsets * fontScale / u_ViewportSize * 2.0 * u_DevicePixelRatio, 0.0, 1.0);
  v_gamma_scale = gl_Position.w;
  setPickingColor(a_PickingColor);

}
