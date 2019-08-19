/**
 * 为文本构建顶点数据，仅支持点要素自动标注。
 * @see https://zhuanlan.zhihu.com/p/72222549
 * @see https://zhuanlan.zhihu.com/p/74373214
 */
import { shapeText, getGlyphQuads } from '../../../util/symbol-layout';

export default function TextBuffer(
  layerData,
  sourceData,
  options,
  fontAtlasManager,
  collisionIndex,
  mvpMatrix
) {
  const {
    fontWeight,
    fontFamily
  } = options;
  const characterSet = [];
  sourceData.forEach(element => {
    // shape 存储了 text-field
    let text = element.shape || '';
    text = text.toString();
    for (let j = 0; j < text.length; j++) {
      // 去重
      if (characterSet.indexOf(text[j]) === -1) {
        characterSet.push(text[j]);
      }
    }
  });
  fontAtlasManager.setProps({
    characterSet,
    fontFamily,
    fontWeight
  });
  return drawGlyph(layerData, sourceData, options, fontAtlasManager, collisionIndex, mvpMatrix);
}

function drawGlyph(
  layerData, sourceData,
  {
    spacing = 2,
    textAnchor = 'center',
    textOffset = [ 0, 0 ],
    padding = [ 4, 4 ]
  },
  fontAtlasManager,
  collisionIndex,
  mvpMatrix
) {
  const { texture, fontAtlas, mapping } = fontAtlasManager;

  const attributes = {
    fontAtlas,
    texture,
    positions: [],
    colors: [],
    pickingIds: [],
    textUVs: [],
    textOffsets: [],
    textSizes: [],
    index: []
  };
  let indexCounter = 0;
  layerData.forEach((feature, i) => {
    const { size, coordinates } = feature;
    // 根据字段获取文本
    const text = `${layerData[i].shape || ''}`;
    // sdf 中默认字号为 24
    const fontScale = size / 24;

    // 1. 计算每个字符相对锚点的位置
    const shaping = shapeText(text, mapping, 24, textAnchor, 'center', spacing, textOffset);

    if (shaping) {
      // 2. 尝试加入空间索引，获取碰撞检测结果
      // TODO：按照 feature 中指定字段排序，确定插入权重，保证优先级高的文本优先展示
      const { box } = collisionIndex.placeCollisionBox({
        x1: shaping.left * fontScale - padding[0],
        x2: shaping.right * fontScale + padding[0],
        y1: shaping.top * fontScale - padding[1],
        y2: shaping.bottom * fontScale + padding[1],
        // 点要素锚点就是当前点位置
        anchorPointX: coordinates[0],
        anchorPointY: coordinates[1]
      }, mvpMatrix);

      // 无碰撞则加入空间索引
      if (box && box.length) {
        // TODO：featureIndex
        collisionIndex.insertCollisionBox(box, 0);

        // 3. 计算可供渲染的文本块，其中每个字符都包含纹理坐标
        const glyphQuads = getGlyphQuads(shaping, textOffset, false);

        // 4. 构建顶点数据，四个顶点组成一个 quad
        indexCounter = addAttributeForFeature(feature, attributes, glyphQuads, indexCounter);
      }
    }
  });
  return attributes;
}

function addAttributeForFeature(feature, attributes, glyphQuads, indexCounter) {
  const { id, size, color, coordinates } = feature;
  glyphQuads.forEach(quad => {

    attributes.pickingIds.push(
      id,
      id,
      id,
      id
    );

    attributes.colors.push(
      ...color,
      ...color,
      ...color,
      ...color
    );

    attributes.positions.push(
      coordinates[0], coordinates[1],
      coordinates[0], coordinates[1],
      coordinates[0], coordinates[1],
      coordinates[0], coordinates[1]
    );

    attributes.textUVs.push(
      quad.tex.x, quad.tex.y + quad.tex.height,
      quad.tex.x + quad.tex.width, quad.tex.y + quad.tex.height,
      quad.tex.x + quad.tex.width, quad.tex.y,
      quad.tex.x, quad.tex.y,
    );

    attributes.textOffsets.push(
      quad.tl.x, quad.tl.y,
      quad.tr.x, quad.tr.y,
      quad.br.x, quad.br.y,
      quad.bl.x, quad.bl.y
    );

    attributes.textSizes.push(
      size,
      size,
      size,
      size
    );

    attributes.index.push(
      0 + indexCounter,
      1 + indexCounter,
      2 + indexCounter,
      2 + indexCounter,
      3 + indexCounter,
      0 + indexCounter
    );
    indexCounter += 4;
  });

  return indexCounter;
}
