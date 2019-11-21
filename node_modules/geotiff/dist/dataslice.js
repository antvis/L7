"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataSlice = function () {
  function DataSlice(arrayBuffer, sliceOffset, littleEndian, bigTiff) {
    (0, _classCallCheck3.default)(this, DataSlice);

    this._dataView = new DataView(arrayBuffer);
    this._sliceOffset = sliceOffset;
    this._littleEndian = littleEndian;
    this._bigTiff = bigTiff;
  }

  (0, _createClass3.default)(DataSlice, [{
    key: "covers",
    value: function covers(offset, length) {
      return this.sliceOffset <= offset && this.sliceTop >= offset + length;
    }
  }, {
    key: "readUint8",
    value: function readUint8(offset) {
      return this._dataView.getUint8(offset - this._sliceOffset, this._littleEndian);
    }
  }, {
    key: "readInt8",
    value: function readInt8(offset) {
      return this._dataView.getInt8(offset - this._sliceOffset, this._littleEndian);
    }
  }, {
    key: "readUint16",
    value: function readUint16(offset) {
      return this._dataView.getUint16(offset - this._sliceOffset, this._littleEndian);
    }
  }, {
    key: "readInt16",
    value: function readInt16(offset) {
      return this._dataView.getInt16(offset - this._sliceOffset, this._littleEndian);
    }
  }, {
    key: "readUint32",
    value: function readUint32(offset) {
      return this._dataView.getUint32(offset - this._sliceOffset, this._littleEndian);
    }
  }, {
    key: "readInt32",
    value: function readInt32(offset) {
      return this._dataView.getInt32(offset - this._sliceOffset, this._littleEndian);
    }
  }, {
    key: "readFloat32",
    value: function readFloat32(offset) {
      return this._dataView.getFloat32(offset - this._sliceOffset, this._littleEndian);
    }
  }, {
    key: "readFloat64",
    value: function readFloat64(offset) {
      return this._dataView.getFloat64(offset - this._sliceOffset, this._littleEndian);
    }
  }, {
    key: "readUint64",
    value: function readUint64(offset) {
      var left = this.readUint32(offset);
      var right = this.readUint32(offset + 4);
      if (this._littleEndian) {
        return left << 32 | right;
      }
      return right << 32 | left;
    }
  }, {
    key: "readInt64",
    value: function readInt64(offset) {
      var left = void 0;
      var right = void 0;
      if (this._littleEndian) {
        left = this.readInt32(offset);
        right = this.readUint32(offset + 4);

        return left << 32 | right;
      }
      left = this.readUint32(offset - this._sliceOffset);
      right = this.readInt32(offset - this._sliceOffset + 4);
      return right << 32 | left;
    }
  }, {
    key: "readOffset",
    value: function readOffset(offset) {
      if (this._bigTiff) {
        return this.readUint64(offset);
      }
      return this.readUint32(offset);
    }
  }, {
    key: "sliceOffset",
    get: function get() {
      return this._sliceOffset;
    }
  }, {
    key: "sliceTop",
    get: function get() {
      return this._sliceOffset + this.buffer.byteLength;
    }
  }, {
    key: "littleEndian",
    get: function get() {
      return this._littleEndian;
    }
  }, {
    key: "bigTiff",
    get: function get() {
      return this._bigTiff;
    }
  }, {
    key: "buffer",
    get: function get() {
      return this._dataView.buffer;
    }
  }]);
  return DataSlice;
}();

exports.default = DataSlice;