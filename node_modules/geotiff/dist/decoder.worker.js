'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _compression = require('./compression');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function decode(self, fileDirectory, buffer) {
  var decoder = (0, _compression.getDecoder)(fileDirectory);
  var result = decoder.decode(fileDirectory, buffer);
  self.postMessage([result], [result]);
} /* eslint-disable no-restricted-globals */

if (typeof self !== 'undefined') {
  self.addEventListener('message', function (event) {
    var _event$data = (0, _toArray3.default)(event.data),
        name = _event$data[0],
        args = _event$data.slice(1);

    switch (name) {
      case 'decode':
        decode.apply(undefined, [self].concat((0, _toConsumableArray3.default)(args)));
        break;
      default:
        break;
    }
  });
}