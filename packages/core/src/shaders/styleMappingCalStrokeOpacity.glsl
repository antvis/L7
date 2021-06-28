
// 计算 strokeOpaicty 和标示在 cell 中取值位置的偏移量 textureOffset
vec2 calStrokeOpacityAndOffset(float cellCurrentRow, float cellCurrentColumn, float columnCount, float textureOffset, float columnWidth, float rowHeight) {
  if(!hasStrokeOpacity()) {
    return vec2(u_stroke_opacity, textureOffset);
  } else {
    vec2 valuePos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    float textureStrokeOpacity = pos2value(valuePos, columnWidth, rowHeight);
    return vec2(textureStrokeOpacity, textureOffset + 1.0);
  }
}
