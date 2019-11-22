'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _predictor = require('../predictor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseDecoder = function () {
  function BaseDecoder() {
    (0, _classCallCheck3.default)(this, BaseDecoder);
  }

  (0, _createClass3.default)(BaseDecoder, [{
    key: 'decode',
    value: function decode(fileDirectory, buffer) {
      var decoded = this.decodeBlock(buffer);
      var predictor = fileDirectory.Predictor || 1;
      if (predictor !== 1) {
        var isTiled = !fileDirectory.StripOffsets;
        var tileWidth = isTiled ? fileDirectory.TileWidth : fileDirectory.ImageWidth;
        var tileHeight = isTiled ? fileDirectory.TileLength : fileDirectory.RowsPerStrip;
        return (0, _predictor.applyPredictor)(decoded, predictor, tileWidth, tileHeight, fileDirectory.BitsPerSample);
      }
      return decoded;
    }
  }]);
  return BaseDecoder;
}();

exports.default = BaseDecoder;