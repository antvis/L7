"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TextBuffer;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function TextBuffer(layerData, fontAtlasManager) {
  var characterSet = [];
  layerData.forEach(function (element) {
    var text = element.shape || '';
    text = text.toString();

    for (var j = 0; j < text.length; j++) {
      if (characterSet.indexOf(text[j]) === -1) {
        characterSet.push(text[j]);
      }
    }
  });
  fontAtlasManager.setProps({
    characterSet: characterSet
  });
  var attr = drawGlyph(layerData, fontAtlasManager);
  return attr;
}

function drawGlyph(layerData, fontAtlasManager) {
  var attributes = {
    originPoints: [],
    textSizes: [],
    textOffsets: [],
    colors: [],
    textureElements: [],
    pickingIds: []
  };
  var texture = fontAtlasManager.texture,
      fontAtlas = fontAtlasManager.fontAtlas,
      mapping = fontAtlasManager.mapping,
      scale = fontAtlasManager.scale;
  layerData.forEach(function (element) {
    var size = element.size;
    var pos = element.coordinates;
    var text = element.shape || '';
    text = text.toString();
    var pen = {
      x: -text.length * size / 2,
      y: 0
    };

    for (var i = 0; i < text.length; i++) {
      var _attributes$colors;

      var metric = mapping[text[i]];
      var x = metric.x,
          y = metric.y,
          width = metric.width,
          height = metric.height;
      var color = element.color;
      var offsetX = pen.x;
      var offsetY = pen.y;
      attributes.pickingIds.push(element.id, element.id, element.id, element.id, element.id, element.id);
      attributes.textOffsets.push( // 文字在词语的偏移量
      offsetX, offsetY, offsetX, offsetY, offsetX, offsetY, offsetX, offsetY, offsetX, offsetY, offsetX, offsetY);
      attributes.originPoints.push( // 词语的经纬度坐标
      pos[0], pos[1], 0, pos[0], pos[1], 0, pos[0], pos[1], 0, pos[0], pos[1], 0, pos[0], pos[1], 0, pos[0], pos[1], 0);
      attributes.textSizes.push(size, size * scale, 0, size * scale, 0, 0, size, size * scale, 0, 0, size, 0);

      (_attributes$colors = attributes.colors).push.apply(_attributes$colors, _toConsumableArray(color).concat(_toConsumableArray(color), _toConsumableArray(color), _toConsumableArray(color), _toConsumableArray(color), _toConsumableArray(color)));

      attributes.textureElements.push( // 文字纹理坐标
      x + width, y, x, y, x, y + height, x + width, y, x, y + height, x + width, y + height);
      pen.x = pen.x + size;
    }
  });
  attributes.texture = texture;
  attributes.fontAtlas = fontAtlas;
  return attributes;
}