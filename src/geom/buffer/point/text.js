export default function TextBuffer2(layerData, fontAtlasManager) {
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
  const attr = generateTextBuffer(layerData, fontAtlasManager);
  return attr;
}
function generateTextBuffer(layerData, fontAtlasManager) {
  const attributes = {
    vertices: [],
    pickingIds: [],
    textSizes: [], // 文字大小 // 长宽
    textOffsets: [], // 文字偏移量
    colors: [],
    textUv: [] // 纹理坐标
  };
  const { texture, fontAtlas, mapping } = fontAtlasManager;
  layerData.forEach(element => {
    const size = element.size;
    const pos = element.coordinates;
    let text = element.shape || '';
    const pen = { x: -text.length * size / 2 + size / 2, y: 0 };
    text = text.toString();
    for (let i = 0; i < text.length; i++) {
      const metric = mapping[text[i]];
      const { x, y, width, height } = metric;
      const color = element.color;
      attributes.vertices.push(...pos);
      attributes.colors.push(...color);
      attributes.textUv.push(x, y, width, height);
      attributes.textOffsets.push(pen.x, pen.y);
      attributes.pickingIds.push(element.id);
      attributes.textSizes.push(size, size);
      pen.x = pen.x + size;
    }
  });
  attributes.texture = texture;
  attributes.fontAtlas = fontAtlas;
  return attributes;
}
