export default function TextBuffer(layerData, fontAtlasManager) {
  const characterSet = [];
  layerData.forEach(element => {
    let text = element.shape || '';
    text = text.toString();
    for (let j = 0; j < text.length; j++) {
      if (characterSet.indexOf(text[j]) === -1) {
        characterSet.push(text[j]);
      }
    }
  });
  fontAtlasManager.setProps({
    characterSet
  });
  const attr = drawGlyph(layerData, fontAtlasManager);
  return attr;
}
function drawGlyph(layerData, fontAtlasManager) {
  const attributes = {
    originPoints: [],
    textSizes: [],
    textOffsets: [],
    colors: [],
    textureElements: [],
    pickingIds: []
  };
  const { texture, fontAtlas, mapping, scale } = fontAtlasManager;
  layerData.forEach(function(element) {
    const size = element.size;
    const pos = element.coordinates;
    let text = element.shape || '';
    const pen = {
      x: (-text.length * size) / 2,
      y: 0
    };
    text = text.toString();

    for (let i = 0; i < text.length; i++) {
      const metric = mapping[text[i]];
      const { x, y, width, height } = metric;
      const color = element.color;
      const offsetX = pen.x;
      const offsetY = pen.y;
      attributes.pickingIds.push(
        element.id,
        element.id,
        element.id,
        element.id,
        element.id,
        element.id
      );
      attributes.textOffsets.push(
        // 文字在词语的偏移量
        offsetX,
        offsetY,
        offsetX,
        offsetY,
        offsetX,
        offsetY,
        offsetX,
        offsetY,
        offsetX,
        offsetY,
        offsetX,
        offsetY
      );
      attributes.originPoints.push(
        // 词语的经纬度坐标
        pos[0],
        pos[1],
        0,
        pos[0],
        pos[1],
        0,
        pos[0],
        pos[1],
        0,
        pos[0],
        pos[1],
        0,
        pos[0],
        pos[1],
        0,
        pos[0],
        pos[1],
        0
      );
      attributes.textSizes.push(
        size,
        size * scale,
        0,
        size * scale,
        0,
        0,
        size,
        size * scale,
        0,
        0,
        size,
        0
      );
      attributes.colors.push(
        ...color,
        ...color,
        ...color,
        ...color,
        ...color,
        ...color
      );
      attributes.textureElements.push(
        // 文字纹理坐标
        x + width,
        y,
        x,
        y,
        x,
        y + height,
        x + width,
        y,
        x,
        y + height,
        x + width,
        y + height
      );
      pen.x = pen.x + size;
    }
  });
  attributes.texture = texture;
  attributes.fontAtlas = fontAtlas;
  return attributes;
}
