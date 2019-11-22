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

var RawDecoder = function (_BaseDecoder) {
  (0, _inherits3.default)(RawDecoder, _BaseDecoder);

  function RawDecoder() {
    (0, _classCallCheck3.default)(this, RawDecoder);
    return (0, _possibleConstructorReturn3.default)(this, (RawDecoder.__proto__ || Object.getPrototypeOf(RawDecoder)).apply(this, arguments));
  }

  (0, _createClass3.default)(RawDecoder, [{
    key: 'decodeBlock',
    value: function decodeBlock(buffer) {
      return buffer;
    }
  }]);
  return RawDecoder;
}(_basedecoder2.default);

exports.default = RawDecoder;