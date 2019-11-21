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

var MIN_BITS = 9;
var CLEAR_CODE = 256; // clear code
var EOI_CODE = 257; // end of information

function getByte(array, position, length) {
  var d = position % 8;
  var a = Math.floor(position / 8);
  var de = 8 - d;
  var ef = position + length - (a + 1) * 8;
  var fg = 8 * (a + 2) - (position + length);
  var dg = (a + 2) * 8 - position;
  fg = Math.max(0, fg);
  if (a >= array.length) {
    console.warn('ran off the end of the buffer before finding EOI_CODE (end on input code)');
    return EOI_CODE;
  }
  var chunk1 = array[a] & Math.pow(2, 8 - d) - 1;
  chunk1 <<= length - de;
  var chunks = chunk1;
  if (a + 1 < array.length) {
    var chunk2 = array[a + 1] >>> fg;
    chunk2 <<= Math.max(0, length - dg);
    chunks += chunk2;
  }
  if (ef > 8 && a + 2 < array.length) {
    var hi = (a + 3) * 8 - (position + length);
    var chunk3 = array[a + 2] >>> hi;
    chunks += chunk3;
  }
  return chunks;
}

function appendReversed(dest, source) {
  for (var i = source.length - 1; i >= 0; i--) {
    dest.push(source[i]);
  }
  return dest;
}

function decompress(input) {
  var dictionaryIndex = new Uint16Array(4093);
  var dictionaryChar = new Uint8Array(4093);
  for (var i = 0; i <= 257; i++) {
    dictionaryIndex[i] = 4096;
    dictionaryChar[i] = i;
  }
  var dictionaryLength = 258;
  var byteLength = MIN_BITS;
  var position = 0;

  function initDictionary() {
    dictionaryLength = 258;
    byteLength = MIN_BITS;
  }
  function getNext(array) {
    var byte = getByte(array, position, byteLength);
    position += byteLength;
    return byte;
  }
  function addToDictionary(i, c) {
    dictionaryChar[dictionaryLength] = c;
    dictionaryIndex[dictionaryLength] = i;
    dictionaryLength++;
    if (dictionaryLength >= Math.pow(2, byteLength)) {
      byteLength++;
    }
    return dictionaryLength - 1;
  }
  function getDictionaryReversed(n) {
    var rev = [];
    for (var _i = n; _i !== 4096; _i = dictionaryIndex[_i]) {
      rev.push(dictionaryChar[_i]);
    }
    return rev;
  }

  var result = [];
  initDictionary();
  var array = new Uint8Array(input);
  var code = getNext(array);
  var oldCode = void 0;
  while (code !== EOI_CODE) {
    if (code === CLEAR_CODE) {
      initDictionary();
      code = getNext(array);
      while (code === CLEAR_CODE) {
        code = getNext(array);
      }
      if (code > CLEAR_CODE) {
        throw new Error('corrupted code at scanline ' + code);
      }
      if (code === EOI_CODE) {
        break;
      } else {
        var val = getDictionaryReversed(code);
        appendReversed(result, val);
        oldCode = code;
      }
    } else if (code < dictionaryLength) {
      var _val = getDictionaryReversed(code);
      appendReversed(result, _val);
      addToDictionary(oldCode, _val[_val.length - 1]);
      oldCode = code;
    } else {
      var oldVal = getDictionaryReversed(oldCode);
      if (!oldVal) {
        throw new Error('Bogus entry. Not in dictionary, ' + oldCode + ' / ' + dictionaryLength + ', position: ' + position);
      }
      appendReversed(result, oldVal);
      result.push(oldVal[oldVal.length - 1]);
      addToDictionary(oldCode, oldVal[oldVal.length - 1]);
      oldCode = code;
    }

    if (dictionaryLength >= Math.pow(2, byteLength) - 1) {
      byteLength++;
    }
    code = getNext(array);
  }
  return new Uint8Array(result);
}

var LZWDecoder = function (_BaseDecoder) {
  (0, _inherits3.default)(LZWDecoder, _BaseDecoder);

  function LZWDecoder() {
    (0, _classCallCheck3.default)(this, LZWDecoder);
    return (0, _possibleConstructorReturn3.default)(this, (LZWDecoder.__proto__ || Object.getPrototypeOf(LZWDecoder)).apply(this, arguments));
  }

  (0, _createClass3.default)(LZWDecoder, [{
    key: 'decodeBlock',
    value: function decodeBlock(buffer) {
      return decompress(buffer, false).buffer;
    }
  }]);
  return LZWDecoder;
}(_basedecoder2.default);

exports.default = LZWDecoder;