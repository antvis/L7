"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.DEFAULT_RADIUS = exports.DEFAULT_CUTOFF = exports.DEFAULT_BUFFER = exports.DEFAULT_FONT_SIZE = exports.DEFAULT_FONT_WEIGHT = exports.DEFAULT_FONT_FAMILY = exports.DEFAULT_CHAR_SET = void 0;

var _tinySdf = _interopRequireDefault(require("@mapbox/tiny-sdf"));

var _fontUtil = require("../../../../util/font-util");

var THREE = _interopRequireWildcard(require("../../../../core/three"));

var _lruCache = _interopRequireDefault(require("./lru-cache"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DEFAULT_CHAR_SET = getDefaultCharacterSet();
exports.DEFAULT_CHAR_SET = DEFAULT_CHAR_SET;
var DEFAULT_FONT_FAMILY = 'sans-serif';
exports.DEFAULT_FONT_FAMILY = DEFAULT_FONT_FAMILY;
var DEFAULT_FONT_WEIGHT = 'normal';
exports.DEFAULT_FONT_WEIGHT = DEFAULT_FONT_WEIGHT;
var DEFAULT_FONT_SIZE = 24;
exports.DEFAULT_FONT_SIZE = DEFAULT_FONT_SIZE;
var DEFAULT_BUFFER = 3;
exports.DEFAULT_BUFFER = DEFAULT_BUFFER;
var DEFAULT_CUTOFF = 0.25;
exports.DEFAULT_CUTOFF = DEFAULT_CUTOFF;
var DEFAULT_RADIUS = 8;
exports.DEFAULT_RADIUS = DEFAULT_RADIUS;
var MAX_CANVAS_WIDTH = 1024;
var BASELINE_SCALE = 0.9;
var HEIGHT_SCALE = 1.2;
var CACHE_LIMIT = 3;
var cache = new _lruCache["default"](CACHE_LIMIT);
var VALID_PROPS = ['fontFamily', 'fontWeight', 'characterSet', 'fontSize', 'sdf', 'buffer', 'cutoff', 'radius'];

function getDefaultCharacterSet() {
  var charSet = [];

  for (var i = 32; i < 128; i++) {
    charSet.push(String.fromCharCode(i));
  }

  return charSet;
}

function setTextStyle(ctx, fontFamily, fontSize, fontWeight) {
  ctx.font = "".concat(fontWeight, " ").concat(fontSize, "px ").concat(fontFamily);
  ctx.fillStyle = '#000';
  ctx.textBaseline = 'baseline';
  ctx.textAlign = 'left';
}

function getNewChars(key, characterSet) {
  var cachedFontAtlas = cache.get(key);

  if (!cachedFontAtlas) {
    return characterSet;
  }

  var newChars = [];
  var cachedMapping = cachedFontAtlas.mapping;
  var cachedCharSet = Object.keys(cachedMapping);
  cachedCharSet = new Set(cachedCharSet);
  var charSet = characterSet;

  if (charSet instanceof Array) {
    charSet = new Set(charSet);
  }

  charSet.forEach(function (_char) {
    if (!cachedCharSet.has(_char)) {
      newChars.push(_char);
    }
  });
  return newChars;
}

function populateAlphaChannel(alphaChannel, imageData) {
  // populate distance value from tinySDF to image alpha channel
  for (var i = 0; i < alphaChannel.length; i++) {
    imageData.data[4 * i + 3] = alphaChannel[i];
  }
}

var FontAtlasManager =
/*#__PURE__*/
function () {
  function FontAtlasManager() {
    _classCallCheck(this, FontAtlasManager);

    // font settings
    this.props = {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontWeight: DEFAULT_FONT_WEIGHT,
      characterSet: DEFAULT_CHAR_SET,
      fontSize: DEFAULT_FONT_SIZE,
      buffer: DEFAULT_BUFFER,
      // sdf only props
      // https://github.com/mapbox/tiny-sdf
      sdf: true,
      cutoff: DEFAULT_CUTOFF,
      radius: DEFAULT_RADIUS
    }; // key is used for caching generated fontAtlas

    this._key = null;
    this._texture = new THREE.Texture();
  }

  _createClass(FontAtlasManager, [{
    key: "setProps",
    value: function setProps() {
      var _this = this;

      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      VALID_PROPS.forEach(function (prop) {
        if (prop in props) {
          _this.props[prop] = props[prop];
        }
      }); // update cache key

      var oldKey = this._key;
      this._key = this._getKey();
      var charSet = getNewChars(this._key, this.props.characterSet);
      var cachedFontAtlas = cache.get(this._key); // if a fontAtlas associated with the new settings is cached and
      // there are no new chars

      if (cachedFontAtlas && charSet.length === 0) {
        // update texture with cached fontAtlas
        if (this._key !== oldKey) {
          this._updateTexture(cachedFontAtlas);
        }

        return;
      } // update fontAtlas with new settings


      var fontAtlas = this._generateFontAtlas(this._key, charSet, cachedFontAtlas);

      this._fontAtlas = fontAtlas;

      this._updateTexture(fontAtlas); // update cache


      cache.set(this._key, fontAtlas);
    }
  }, {
    key: "_updateTexture",
    value: function _updateTexture(_ref) {
      var canvas = _ref.data;
      this._texture = new THREE.CanvasTexture(canvas);
      this._texture.wrapS = THREE.ClampToEdgeWrapping;
      this._texture.wrapT = THREE.ClampToEdgeWrapping;
      this._texture.minFilter = THREE.LinearFilter;
      this._texture.flipY = false;
      this._texture.needUpdate = true;
    }
  }, {
    key: "_generateFontAtlas",
    value: function _generateFontAtlas(key, characterSet, cachedFontAtlas) {
      var _this$props = this.props,
          fontFamily = _this$props.fontFamily,
          fontWeight = _this$props.fontWeight,
          fontSize = _this$props.fontSize,
          buffer = _this$props.buffer,
          sdf = _this$props.sdf,
          radius = _this$props.radius,
          cutoff = _this$props.cutoff;
      var canvas = cachedFontAtlas && cachedFontAtlas.data;

      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = MAX_CANVAS_WIDTH;
      }

      var ctx = canvas.getContext('2d');
      setTextStyle(ctx, fontFamily, fontSize, fontWeight); // 1. build mapping

      var _buildMapping = (0, _fontUtil.buildMapping)(Object.assign({
        getFontWidth: function getFontWidth(_char2) {
          return ctx.measureText(_char2).width;
        },
        fontHeight: fontSize * HEIGHT_SCALE,
        buffer: buffer,
        characterSet: characterSet,
        maxCanvasWidth: MAX_CANVAS_WIDTH
      }, cachedFontAtlas && {
        mapping: cachedFontAtlas.mapping,
        xOffset: cachedFontAtlas.xOffset,
        yOffset: cachedFontAtlas.yOffset
      })),
          mapping = _buildMapping.mapping,
          canvasHeight = _buildMapping.canvasHeight,
          xOffset = _buildMapping.xOffset,
          yOffset = _buildMapping.yOffset; // 2. update canvas
      // copy old canvas data to new canvas only when height changed


      if (canvas.height !== canvasHeight) {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.height = canvasHeight;
        ctx.putImageData(imageData, 0, 0);
      }

      setTextStyle(ctx, fontFamily, fontSize, fontWeight); // 3. layout characters

      if (sdf) {
        var tinySDF = new _tinySdf["default"](fontSize, buffer, radius, cutoff, fontFamily, fontWeight); // used to store distance values from tinySDF
        // tinySDF.size equals `fontSize + buffer * 2`

        var _imageData = ctx.getImageData(0, 0, tinySDF.size, tinySDF.size);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = characterSet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _char3 = _step.value;
            populateAlphaChannel(tinySDF.draw(_char3), _imageData);
            ctx.putImageData(_imageData, mapping[_char3].x - buffer, mapping[_char3].y - buffer);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = characterSet[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _char4 = _step2.value;
            ctx.fillText(_char4, mapping[_char4].x, mapping[_char4].y + fontSize * BASELINE_SCALE);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      return {
        xOffset: xOffset,
        yOffset: yOffset,
        mapping: mapping,
        data: canvas,
        width: canvas.width,
        height: canvas.height
      };
    }
  }, {
    key: "_getKey",
    value: function _getKey() {
      var _this$props2 = this.props,
          fontFamily = _this$props2.fontFamily,
          fontWeight = _this$props2.fontWeight,
          fontSize = _this$props2.fontSize,
          buffer = _this$props2.buffer,
          sdf = _this$props2.sdf,
          radius = _this$props2.radius,
          cutoff = _this$props2.cutoff;

      if (sdf) {
        return "".concat(fontFamily, " ").concat(fontWeight, " ").concat(fontSize, " ").concat(buffer, " ").concat(radius, " ").concat(cutoff);
      }

      return "".concat(fontFamily, " ").concat(fontWeight, " ").concat(fontSize, " ").concat(buffer);
    }
  }, {
    key: "texture",
    get: function get() {
      return this._texture;
    }
  }, {
    key: "mapping",
    get: function get() {
      var data = cache.get(this._key);
      return data && data.mapping;
    }
  }, {
    key: "scale",
    get: function get() {
      return HEIGHT_SCALE;
    }
  }, {
    key: "fontAtlas",
    get: function get() {
      return this._fontAtlas;
    }
  }]);

  return FontAtlasManager;
}();

exports["default"] = FontAtlasManager;