"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bufferBase = _interopRequireDefault(require("./bufferBase"));

var _ajax = require("../../util/ajax");

var THREE = _interopRequireWildcard(require("../../core/three"));

var _tinySdf = _interopRequireDefault(require("@mapbox/tiny-sdf"));

var _global = _interopRequireDefault(require("../../global"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Space = 1;

var TextBuffer =
/*#__PURE__*/
function (_BufferBase) {
  _inherits(TextBuffer, _BufferBase);

  function TextBuffer() {
    _classCallCheck(this, TextBuffer);

    return _possibleConstructorReturn(this, _getPrototypeOf(TextBuffer).apply(this, arguments));
  }

  _createClass(TextBuffer, [{
    key: "geometryBuffer",
    value: function geometryBuffer() {
      var _this = this;

      this.metrics = {
        buffer: 3,
        family: 'ios9',
        size: 24
      };
      var layerData = this.get('layerData');

      var _this$get = this.get('style'),
          _this$get$textOffset = _this$get.textOffset,
          textOffset = _this$get$textOffset === void 0 ? [0, 0] : _this$get$textOffset;

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

      var sdfTexture = this._updateSdf(Object.keys(textChars).join(''));

      this.sdfTexture = sdfTexture;

      this._loadTextInfo(chars);

      this.on('SourceLoaded', function () {
        var textureElements = [];
        var colors = [];
        var originPoints = [];
        var textSizes = [];
        var textOffsets = [];
        layerData.forEach(function (element) {
          var size = element.size;
          var pos = element.coordinates; // const pen = { x: pos[0] - dimensions.advance / 2, y: pos[1] };

          var pen = {
            x: textOffset[0],
            y: textOffset[1]
          };
          var text = element.shape || '';
          text = text.toString();

          for (var i = 0; i < text.length; i++) {
            var color = element.color;

            _this._drawGlyph(pos, text[i], pen, size, colors, textureElements, originPoints, textSizes, textOffsets, color);
          }
        });
        _this.bufferStruct.style = layerData;
        _this.attributes = {
          originPoints: originPoints,
          textSizes: textSizes,
          textOffsets: textOffsets,
          colors: colors,
          textureElements: textureElements
        };

        _this.emit('completed');
      });
    }
  }, {
    key: "_loadTextInfo",
    value: function _loadTextInfo(chars) {
      var _this2 = this;

      (0, _ajax.getJSON)({
        url: "".concat(_global.default.sdfHomeUrl, "/getsdfdata?chars=").concat(chars.join('|'))
      }, function (e, info) {
        _this2.metrics.chars = info.info;

        _this2._loadTextTexture(info.url);
      });
    }
  }, {
    key: "_loadTextTexture",
    value: function _loadTextTexture(url) {
      var _this3 = this;

      var img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = function () {
        _this3.bufferStruct.textTexture = _this3._creatTexture(_this3.sdfTexture.texure);

        _this3.emit('SourceLoaded');
      };

      img.src = url;
    }
    /**
     * 计算每个标注词语的位置
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

  }, {
    key: "_drawGlyph",
    value: function _drawGlyph(pos, text, pen, size, colors, textureElements, originPoints, textSizes, textOffsets, color) {
      var metrics = this.metrics;
      var chr = text.charCodeAt(0);
      var metric = metrics.chars[chr];
      if (!metric) return;
      var info = this.sdfTexture.info;
      var _info$text = info[text],
          x = _info$text.x,
          y = _info$text.y;
      var scale = size / metrics.size;
      var width = 24; // metric[0];

      var height = 24; // metric[1];
      // const horiBearingX = metric[2];
      // const horiBearingY = metric[3];
      //  const horiAdvance = metric[4];
      // const posX = metric[5];
      // const posY = metric[6];

      var posX = x;
      var posY = y;
      var buffer = metrics.buffer;

      if (width > 0 && height > 0) {
        width += buffer * 2;
        height += buffer * 2; // Add a quad (= two triangles) per glyph.
        // const originX = (horiBearingX - buffer + width / 2) * scale;
        // const originY = -(height - horiBearingY) * scale;

        var originX = 0;
        var originY = 0; // const offsetWidth = width / 2 * scale / (1.0 - horiBearingX * 1.5 / horiAdvance);
        // const offsetHeight = (horiAdvance / 2) * scale;
        // const offsetWidth = width/2 * scale;
        // const offsetHeight = height / 2 * scale;
        //  const offsetHeight = height * scale;

        var offsetX = pen.x;
        var offsetY = pen.y;
        originPoints.push(pos[0] + originX, pos[1] + originY, 0, pos[0] + originX, pos[1] + originY, 0, pos[0] + originX, pos[1] + originY, 0, pos[0] + originX, pos[1] + originY, 0, pos[0] + originX, pos[1] + originY, 0, pos[0] + originX, pos[1] + originY, 0); // textSizes.push(
        // offsetWidth, offsetHeight,
        // -offsetWidth, offsetHeight,
        // -offsetWidth, -offsetHeight,
        // offsetWidth, offsetHeight,
        // -offsetWidth, -offsetHeight,
        // offsetWidth, -offsetHeight,
        // );

        var bx = 0;
        var by = metrics.size / 2 + buffer;
        textSizes.push((bx - buffer + width) * scale, (height - by) * scale, (bx - buffer) * scale, (height - by) * scale, (bx - buffer) * scale, -by * scale, (bx - buffer + width) * scale, (height - by) * scale, (bx - buffer) * scale, -by * scale, (bx - buffer + width) * scale, -by * scale);
        textOffsets.push(offsetX, offsetY, offsetX, offsetY, offsetX, offsetY, offsetX, offsetY, offsetX, offsetY, offsetX, offsetY);
        colors.push.apply(colors, _toConsumableArray(color).concat(_toConsumableArray(color), _toConsumableArray(color), _toConsumableArray(color), _toConsumableArray(color), _toConsumableArray(color)));
        textureElements.push(posX + width, posY, posX, posY, posX, posY + height, posX + width, posY, posX, posY + height, posX + width, posY + height);
      } // pen.x = pen.x + (horiAdvance + Space) * scale;


      pen.x = pen.x + size * 1.8;
    }
  }, {
    key: "_measureText",
    value: function _measureText(text, size) {
      var dimensions = {
        advance: 0
      };
      var metrics = this.metrics;
      var scale = size / metrics.size;

      for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        var horiAdvance = metrics.chars[code][4];
        dimensions.advance += (horiAdvance + Space) * scale;
      }

      return dimensions;
    }
  }, {
    key: "_creatTexture",
    value: function _creatTexture(image) {
      this.bufferStruct.textSize = [image.width, image.height];
      var texture = new THREE.Texture(image);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
      return texture;
    }
  }, {
    key: "_updateSdf",
    value: function _updateSdf(chars) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var sdfs = {};
      var fontSize = 24;
      var fontWeight = 100;
      var buffer = fontSize / 8;
      var radius = fontSize / 3;
      var canvasSize = Math.floor(Math.pow(chars.length, 0.5)) * (fontSize + buffer + radius);
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var sdf = new _tinySdf.default(fontSize, buffer, radius, null, null, fontWeight);

      for (var y = 0, i = 0; y + sdf.size <= canvas.height && i < chars.length; y += sdf.size) {
        for (var x = 0; x + sdf.size <= canvas.width && i < chars.length; x += sdf.size) {
          ctx.putImageData(this._makeRGBAImageData(ctx, sdf.draw(chars[i]), sdf.size), x, y);
          sdfs[chars[i]] = {
            x: x,
            y: y
          };
          i++;
        }
      }

      return {
        info: sdfs,
        texure: canvas
      };
    }
  }, {
    key: "_makeRGBAImageData",
    value: function _makeRGBAImageData(ctx, alphaChannel, size) {
      var imageData = ctx.createImageData(size, size);
      var data = imageData.data;

      for (var i = 0; i < alphaChannel.length; i++) {
        data[4 * i + 0] = alphaChannel[i];
        data[4 * i + 1] = alphaChannel[i];
        data[4 * i + 2] = alphaChannel[i];
        data[4 * i + 3] = 255;
      }

      return imageData;
    }
  }]);

  return TextBuffer;
}(_bufferBase.default);

exports.default = TextBuffer;