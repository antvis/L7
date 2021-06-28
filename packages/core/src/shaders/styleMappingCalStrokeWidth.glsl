
// 计算 strokeWidth 和标示在 cell 中取值位置的偏移量 textureOffset
vec2 calStrokeWidthAndOffset(float cellCurrentRow, float cellCurrentColumn, float columnCount, float textureOffset, float columnWidth, float rowHeight) {
  if(!hasStrokeWidth()) {
    return vec2(u_stroke_width, textureOffset);
  } else {
    vec2 valuePos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    float textureStrokeWidth = pos2value(valuePos, columnWidth, rowHeight);
    return vec2(textureStrokeWidth, textureOffset + 1.0);
  }
}
