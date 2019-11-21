'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDecoder = getDecoder;

var _raw = require('./raw');

var _raw2 = _interopRequireDefault(_raw);

var _lzw = require('./lzw');

var _lzw2 = _interopRequireDefault(_lzw);

var _jpeg = require('./jpeg');

var _jpeg2 = _interopRequireDefault(_jpeg);

var _deflate = require('./deflate');

var _deflate2 = _interopRequireDefault(_deflate);

var _packbits = require('./packbits');

var _packbits2 = _interopRequireDefault(_packbits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDecoder(fileDirectory) {
  switch (fileDirectory.Compression) {
    case undefined:
    case 1:
      // no compression
      return new _raw2.default();
    case 5:
      // LZW
      return new _lzw2.default();
    case 6:
      // JPEG
      throw new Error('old style JPEG compression is not supported.');
    case 7:
      // JPEG
      // throw new Error('JPEG compression not supported.');
      return new _jpeg2.default(fileDirectory);
    case 8:
      // Deflate
      return new _deflate2.default();
    // case 32946: // deflate ??
    //  throw new Error("Deflate compression not supported.");
    case 32773:
      // packbits
      return new _packbits2.default();
    default:
      throw new Error('Unknown compression method identifier: ' + fileDirectory.Compression);
  }
}