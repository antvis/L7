"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataView64 = function () {
  function DataView64(arrayBuffer) {
    (0, _classCallCheck3.default)(this, DataView64);

    this._dataView = new DataView(arrayBuffer);
  }

  (0, _createClass3.default)(DataView64, [{
    key: "getUint64",
    value: function getUint64(offset, littleEndian) {
      var left = this.getUint32(offset, littleEndian);
      var right = this.getUint32(offset + 4, littleEndian);
      if (littleEndian) {
        return left << 32 | right;
      }
      return right << 32 | left;
    }
  }, {
    key: "getInt64",
    value: function getInt64(offset, littleEndian) {
      var left = void 0;
      var right = void 0;
      if (littleEndian) {
        left = this.getInt32(offset, littleEndian);
        right = this.getUint32(offset + 4, littleEndian);

        return left << 32 | right;
      }
      left = this.getUint32(offset, littleEndian);
      right = this.getInt32(offset + 4, littleEndian);
      return right << 32 | left;
    }
  }, {
    key: "getUint8",
    value: function getUint8(offset, littleEndian) {
      return this._dataView.getUint8(offset, littleEndian);
    }
  }, {
    key: "getInt8",
    value: function getInt8(offset, littleEndian) {
      return this._dataView.getInt8(offset, littleEndian);
    }
  }, {
    key: "getUint16",
    value: function getUint16(offset, littleEndian) {
      return this._dataView.getUint16(offset, littleEndian);
    }
  }, {
    key: "getInt16",
    value: function getInt16(offset, littleEndian) {
      return this._dataView.getInt16(offset, littleEndian);
    }
  }, {
    key: "getUint32",
    value: function getUint32(offset, littleEndian) {
      return this._dataView.getUint32(offset, littleEndian);
    }
  }, {
    key: "getInt32",
    value: function getInt32(offset, littleEndian) {
      return this._dataView.getInt32(offset, littleEndian);
    }
  }, {
    key: "getFloat32",
    value: function getFloat32(offset, littleEndian) {
      return this._dataView.getFloat32(offset, littleEndian);
    }
  }, {
    key: "getFloat64",
    value: function getFloat64(offset, littleEndian) {
      return this._dataView.getFloat64(offset, littleEndian);
    }
  }, {
    key: "buffer",
    get: function get() {
      return this._dataView.buffer;
    }
  }]);
  return DataView64;
}();

exports.default = DataView64;