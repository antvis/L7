"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TextBuffer;

var _ajax = require("../../../util/ajax");

var _wolfy87Eventemitter = _interopRequireDefault(require("wolfy87-eventemitter"));

var _global = _interopRequireDefault(require("../../../global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// const Space = 1;
var metrics = {
  buffer: 3,
  family: 'ios9',
  size: 24
};

function TextBuffer(layerData, style) {
  var _this = this;

  _wolfy87Eventemitter.default.call(this);

  var attributes = {
    originPoints: [],
    textSizes: [],
    textOffsets: [],
    colors: [],
    textureElements: []
  };
  var _style$textOffset = style.textOffset,
      textOffset = _style$textOffset === void 0 ? [0, 0] : _style$textOffset;
  var chars = [];
  var textChars = {};
  layerData.forEach(function (element) {
    var text = element.shape || '';
    text = text.toString();

    for (var j = 0; j < text.length; j++) {
      var code = text.charCodeAt(j);
      textChars[text] = 0;

      if (chars.indexOf(code) === -1) {
        chars.push(text.charCodeAt(j));
      }
    }
  });
  loadTextInfo(chars, function (chars, texture) {
    layerData.forEach(function (element) {
      var size = element.size;
      var pos = layerData.coordinates;
      var pen = {
        x: textOffset[0],
        y: textOffset[1]
      };
      var text = element.shape || '';
      text = text.toString();

      for (var i = 0; i < text.length; i++) {
        var color = element.color;
        drawGlyph(chars, pos, text[i], pen, size, attributes.colors, attributes.textureElements, attributes.originPoints, attributes.textSizes, attributes.textOffsets, color);
      }

      _this.emit('completed', {
        attributes: attributes,
        texture: texture
      });
    });
  });
}

function loadTextInfo(chars, done) {
  (0, _ajax.getJSON)({
    url: "".concat(_global.default.sdfHomeUrl, "/getsdfdata?chars=").concat(chars.join('|'))
  }, function (e, info) {
    loadTextTexture(info.url, function (texture) {
      done(info.info, texture);
    });
  });
}

function loadTextTexture(url, cb) {
  var _this2 = this;

  var img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = function () {
    var textTexture = _this2._creatTexture(img);

    cb(textTexture);
  };

  img.src = url;
}
/**
   * 计算每个标注词语的位置
   * @param {*} chars 文本信息
   * @param {*} pos 文字三维空间坐标
   * @param {*} text 字符
   * @param {*} pen 字符在词语的偏移量
   * @param {*} size 字体大小
   * @param {*} colors 颜色
   * @param {*} textureElements  纹理坐标
   * @param {*} originPoints 初始位置数据
   * @param {*} textSizes 文字大小数组
   * @param {*} textOffsets 字体偏移量数据
   * @param {*} color 文字颜色
   */


function drawGlyph(chars, pos, text, pen, size, colors, textureElements, originPoints, textSizes, textOffsets, color) {
  var chr = text.charCodeAt(0);
  var metric = chars[chr];
  if (!metric) return;
  var scale = size / metrics.size;
  var width = metric[0];
  var height = metric[1];
  var posX = metric[5];
  var posY = metric[6];
  var buffer = metrics.buffer;

  if (width > 0 && height > 0) {
    width += buffer * 2;
    height += buffer * 2;
    var originX = 0;
    var originY = 0;
    var offsetX = pen.x;
    var offsetY = pen.y;
    originPoints.push(pos[0] + originX, pos[1] + originY, 0, pos[0] + originX, pos[1] + originY, 0, pos[0] + originX, pos[1] + originY, 0, pos[0] + originX, pos[1] + originY, 0, pos[0] + originX, pos[1] + originY, 0, pos[0] + originX, pos[1] + originY, 0);
    var bx = 0;
    var by = metrics.size / 2 + buffer;
    textSizes.push((bx - buffer + width) * scale, (height - by) * scale, (bx - buffer) * scale, (height - by) * scale, (bx - buffer) * scale, -by * scale, (bx - buffer + width) * scale, (height - by) * scale, (bx - buffer) * scale, -by * scale, (bx - buffer + width) * scale, -by * scale);
    textOffsets.push(offsetX, offsetY, offsetX, offsetY, offsetX, offsetY, offsetX, offsetY, offsetX, offsetY, offsetX, offsetY);
    colors.push.apply(colors, _toConsumableArray(color).concat(_toConsumableArray(color), _toConsumableArray(color), _toConsumableArray(color), _toConsumableArray(color), _toConsumableArray(color)));
    textureElements.push(posX + width, posY, posX, posY, posX, posY + height, posX + width, posY, posX, posY + height, posX + width, posY + height);
  }

  pen.x = pen.x + size * 1.8;
} // function measureText(text, size) {
//   const dimensions = {
//     advance: 0
//   };
//   const metrics = this.metrics;
//   const scale = size / metrics.size;
//   for (let i = 0; i < text.length; i++) {
//     const code = text.charCodeAt(i);
//     const horiAdvance = metrics.chars[code][4];
//     dimensions.advance += (horiAdvance + Space) * scale;
//   }
//   return dimensions;
// }
// function creatTexture(image) {
//   this.bufferStruct.textSize = [ image.width, image.height ];
//   const texture = new THREE.Texture(image);
//   texture.minFilter = THREE.LinearFilter;
//   texture.magFilter = THREE.ClampToEdgeWrapping;
//   texture.needsUpdate = true;
//   return texture;
// }