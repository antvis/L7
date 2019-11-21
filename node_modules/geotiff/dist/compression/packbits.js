'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _basedecoder = require('./basedecoder');

var _basedecoder2 = _interopRequireDefault(_basedecoder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PackbitsDecoder = function (_BaseDecoder) {
  (0, _inherits3.default)(PackbitsDecoder, _BaseDecoder);

  function PackbitsDecoder() {
    (0, _classCallCheck3.default)(this, PackbitsDecoder);
    return (0, _possibleConstructorReturn3.default)(this, (PackbitsDecoder.__proto__ || Object.getPrototypeOf(PackbitsDecoder)).apply(this, arguments));
  }

  (0, _createClass3.default)(PackbitsDecoder, [{
    key: 'decodeBlock',
    value: function decodeBlock(buffer) {
      var dataView = new DataView(buffer);
      var out = [];

      for (var i = 0; i < buffer.byteLength; ++i) {
        var header = dataView.getInt8(i);
        if (header < 0) {
          var next = dataView.getUint8(i + 1);
          header = -header;
          for (var j = 0; j <= header; ++j) {
            out.push(next);
          }
          i += 1;
        } else {
          for (var _j = 0; _j <= header; ++_j) {
            out.push(dataView.getUint8(i + _j + 1));
          }
          i += header + 1;
        }
      }
      return new Uint8Array(out).buffer;
    }
  }]);
  return PackbitsDecoder;
}(_basedecoder2.default);

exports.default = PackbitsDecoder;