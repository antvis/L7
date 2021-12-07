attribute float a_vertexId;

uniform mat4 u_cellTypeLayout;      // 描述数据纹理 cell 结构的矩阵
uniform sampler2D u_dataTexture;    // 数据纹理

bool hasOpacity() { // 判断 cell 中是否存在 opacity 的数据
  return u_cellTypeLayout[1][0] > 0.0 && u_cellTypeLayout[3][3] > 0.0;
}

bool hasStrokeOpacity() { // 判断 cell 中是否存在 strokeOpacity 的数据
  return u_cellTypeLayout[1][1] > 0.0 && u_cellTypeLayout[3][3] > 0.0;
}

bool hasStrokeWidth() { // 判断 cell 中是否存在 strokeWidth 的数据
  return u_cellTypeLayout[1][2] > 0.0 && u_cellTypeLayout[3][3] > 0.0;
}

bool hasStroke() { // 判断 cell 中是否存在 stroke 的数据
  return u_cellTypeLayout[1][3] > 0.0 && u_cellTypeLayout[3][3] > 0.0;
}

bool hasOffsets() { // 判断 cell 中是否存在 offsets 的数据
  return u_cellTypeLayout[2][0] > 0.0 && u_cellTypeLayout[3][3] > 0.0;
}

bool hasThetaOffset() { // 判断 cell 中是否存在 thetaOffset 的数据
  return u_cellTypeLayout[2][1] > 0.0 && u_cellTypeLayout[3][3] > 0.0;
}

// 根据坐标位置先是计算 uv ，然后根据 uv 从数据纹理中取值
float pos2value(vec2 pos, float columnWidth, float rowHeight) {
  float u = (pos.r - 1.0) * columnWidth + columnWidth/2.0;
  float v = 1.0 - ((pos.g - 1.0) * rowHeight + rowHeight/2.0);
  return texture2D(u_dataTexture, vec2(u, v)).r;
}

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

// 计算当前单个 cell 的大小
float calCellCount() { 
  //   u_cellTypeLayout
  //   cal_height, WIDTH, 0.0, 0.0, // rowCount columnCount - 几行几列
  //   1.0, 1.0, 1.0, 0.0, // opacity strokeOpacity strokeWidth stroke - 1.0 表示有数据映射、0.0 表示没有
  //   1.0, 1.0, 0.0, 0.0, // offsets thetaOffset
  //   0.0, 0.0, 0.0, 0.0
  
  return  u_cellTypeLayout[1][0] +        // opacity
          u_cellTypeLayout[1][1] +        // strokeOpacity
          u_cellTypeLayout[1][2] +        // strokeWidth
          u_cellTypeLayout[1][3] * 4.0 +  // stroke
          u_cellTypeLayout[2][0] * 2.0 +  // offsets
          u_cellTypeLayout[2][1];         // thetaOffset
}