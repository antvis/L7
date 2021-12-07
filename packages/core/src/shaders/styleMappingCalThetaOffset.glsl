
// 计算 thetaOffset 和标示在 cell 中取值位置的偏移量 textureOffset
vec2 calThetaOffsetAndOffset(float cellCurrentRow, float cellCurrentColumn, float columnCount, float textureOffset, float columnWidth, float rowHeight) {
  if(!hasThetaOffset()) { // 数据纹理中不存在 thetaOffset 的时候取默认值（用户在 style 中传入的是常量）
    return vec2(u_thetaOffset, textureOffset);
  } else {
    vec2 valuePos = nextPos(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset);
    float textureThetaOffset = pos2value(valuePos, columnWidth, rowHeight);
    return vec2(textureThetaOffset, textureOffset + 1.0);
  }
}
