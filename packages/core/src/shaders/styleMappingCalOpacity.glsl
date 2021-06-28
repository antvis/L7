
// 计算 opacity 和标示在 cell 中取值位置的偏移量 textureOffset
vec2 calOpacityAndOffset(float cellCurrentRow, float cellCurrentColumn, float columnCount, float textureOffset, float columnWidth, float rowHeight) {
  if(!hasOpacity()) { // 数据纹理中不存在 opacity 的时候取默认值（用户在 style 中传入的是常量）
    return vec2(u_opacity, textureOffset);
  } else {
    vec2 valuePos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    float textureOpacity = pos2value(valuePos, columnWidth, rowHeight);
    return vec2(textureOpacity, textureOffset + 1.0);
  }
}
