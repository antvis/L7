attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec2 a_Extrude;
attribute float a_Size;
attribute float a_Shape;

attribute float a_vertexId;
uniform mat4 u_cellTypeLayout;
uniform sampler2D u_testTexture;
varying mat4 styleMappingMat;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

uniform float u_opacity : 1;
uniform float u_stroke_opacity : 1;
uniform float u_stroke_width : 2;
uniform vec4 u_stroke_color : [0.0, 0.0, 0.0, 0.0];
uniform vec2 u_offsets;


#pragma include "projection"
#pragma include "picking"


/*
  currentRow 当前行
  currentColumn 当前列
  columnCount 有多少列
  nextStep 需要计算当前 cell 后的第几个 cell （当前 cell 则 nextStep = 0）
*/
vec2 nextPos(float currentRow, float currentColumn, float columnCount, float nextStep) {
  float nextColumn = currentColumn;
  float nextRow = currentRow;
  if(currentColumn + nextStep <= columnCount){
    nextColumn = currentColumn + nextStep;
  } else {
    nextColumn = mod(currentColumn + nextStep, columnCount); // 不会出现跨两行
    nextRow = currentRow + 1.0;
  }
  return vec2(nextColumn, nextRow);
}

// 根据坐标位置先是计算 uv ，然后根据 uv 从数据纹理中取值
float pos2value(vec2 pos, float columnWidth, float rowHeight) {
  float u = (pos.r - 1.0) * columnWidth + columnWidth/2.0;
  float v = 1.0 - ((pos.g - 1.0) * rowHeight + rowHeight/2.0);
  return texture2D(u_testTexture, vec2(u, v)).r;
}

bool hasOpacity() { // 判断 cell 中是否存在 opacity 的数据
  return u_cellTypeLayout[1][0] > 0.0;
}

bool hasStrokeOpacity() { // 判断 cell 中是否存在 strokeOpacity 的数据
  return u_cellTypeLayout[1][1] > 0.0;
}

bool hasStrokeWidth() { // 判断 cell 中是否存在 strokeWidth 的数据
  return u_cellTypeLayout[1][2] > 0.0;
}

bool hasStroke() { // 判断 cell 中是否存在 stroke 的数据
  return u_cellTypeLayout[1][3] > 0.0;
}

bool hasOffsets() { // 判断 cell 中是否存在 offsets 的数据
  return u_cellTypeLayout[2][0] > 0.0;
}

// 计算 opacity 和标志在 cell 中取值用的 offset
vec2 calOpacityAndOffset(float cellCurrentRow, float cellCurrentColumn, float columnCount, float textureOffset, float columnWidth, float rowHeight) {
  if(!hasOpacity()) { // 数据纹理中不存在 opacity 的时候取默认值（用户在 style 中传入的是常量）
    return vec2(u_opacity, textureOffset);
  } else {
    vec2 valuePos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    float textureOpacity = pos2value(valuePos, columnWidth, rowHeight);
    return vec2(textureOpacity, textureOffset + 1.0);
  }
}

vec2 calStrokeOpacityAndOffset(float cellCurrentRow, float cellCurrentColumn, float columnCount, float textureOffset, float columnWidth, float rowHeight) {
  if(!hasStrokeOpacity()) {
    return vec2(u_stroke_opacity, textureOffset);
  } else {
    vec2 valuePos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    float textureStrokeOpacity = pos2value(valuePos, columnWidth, rowHeight);
    return vec2(textureStrokeOpacity, textureOffset + 1.0);
  }
}

vec2 calStrokeWidthAndOffset(float cellCurrentRow, float cellCurrentColumn, float columnCount, float textureOffset, float columnWidth, float rowHeight) {
  if(!hasStrokeWidth()) {
    return vec2(u_stroke_width, textureOffset);
  } else {
    vec2 valuePos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    float textureStrokeWidth = pos2value(valuePos, columnWidth, rowHeight);
    return vec2(textureStrokeWidth, textureOffset + 1.0);
  }
}

float calCellCount() { // 计算当前单个 cell 的大小
  //   u_cellTypeLayout
  //   cal_height, WIDTH, 0.0, 0.0, // rowCount columnCount - 几行几列
  //   1.0, 1.0, 1.0, 0.0, // opacity strokeOpacity strokeWidth stroke - 1.0 表示有数据映射、0.0 表示没有
  //   1.0, 0.0, 0.0, 0.0, // offsets
  //   0.0, 0.0, 0.0, 0.0
  
  return  u_cellTypeLayout[1][0] +        // opacity
          u_cellTypeLayout[1][1] +        // strokeOpacity
          u_cellTypeLayout[1][2] +        // strokeWidth
          u_cellTypeLayout[1][3] * 4.0 +  // stroke
          u_cellTypeLayout[2][0] * 2.0;   // offsets
}

void main() {
  vec2 extrude = a_Extrude;
  float shape_type = a_Shape;
  float newSize = setPickingSize(a_Size);

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

  vec2 strokeOpacityAndOffset = calStrokeOpacityAndOffset(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset, columnWidth, rowHeight);
  styleMappingMat[0][1] = strokeOpacityAndOffset.r;
  textureOffset = strokeOpacityAndOffset.g;

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
    styleMappingMat[1][0] = u_stroke_color.r;
    styleMappingMat[1][1] = u_stroke_color.g;
    styleMappingMat[1][2] = u_stroke_color.b;
    styleMappingMat[1][3] = u_stroke_color.a;
  }

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

  // unpack color(vec2)
  v_color = a_Color;

  // radius(16-bit)
  v_radius = newSize;

  // TODO: billboard
  // anti-alias
  float antialiasblur = 1.0 / u_DevicePixelRatio / (newSize + u_stroke_width);

  // construct point coords
  v_data = vec4(extrude, antialiasblur,shape_type);

  // vec2 offset = project_pixel(extrude * (newSize + u_stroke_width) + u_offsets);
  vec2 offset = project_pixel(extrude * (newSize + u_stroke_width) + textrueOffsets);
  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));
  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(project_pos.xy + offset, 0.0, 1.0);
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));
  }

  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

  setPickingColor(a_PickingColor);
}
