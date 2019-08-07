"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _buffer = _interopRequireDefault(require("../buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LineBuffer =
/*#__PURE__*/
function (_BufferBase) {
  _inherits(LineBuffer, _BufferBase);

  function LineBuffer() {
    _classCallCheck(this, LineBuffer);

    return _possibleConstructorReturn(this, _getPrototypeOf(LineBuffer).apply(this, arguments));
  }

  _createClass(LineBuffer, [{
    key: "_buildFeatures",
    value: function _buildFeatures() {
      var _this = this;

      var layerData = this.get('layerData');
      var offsetVertices = 0;
      var offsetIndex = 0;
      var offset = 0;
      layerData.forEach(function (feature) {
        var coordinates = feature.coordinates;
        coordinates.forEach(function (coord) {
          var n = coord.length;
          feature.bufferInfo = {
            verticesOffset: offsetVertices
          };

          _this._encodeArray(feature, n);

          for (var i = 0; i < n; i++) {
            _this.attributes.positions[offsetVertices * 3] = coord[i][0];
            _this.attributes.positions[offsetVertices * 3 + 1] = coord[i][1];
            _this.attributes.positions[offsetVertices * 3 + 2] = coord[i][2];
            _this.indexArray[offsetIndex * 2] = i + offset;
            _this.indexArray[offsetIndex * 2 + 1] = i + offset + 1;

            if (i === n - 1) {
              _this.indexArray[offsetIndex * 2 + 1] = offsetVertices - n + 1;
            }

            offsetVertices++;
            offsetIndex++;
          }

          offset += n;
        });
      });
    }
  }, {
    key: "_calculateBufferLength",
    value: function _calculateBufferLength() {
      var _this2 = this;

      var layerData = this.get('layerData');
      layerData.forEach(function (feature) {
        var coordinates = feature.coordinates;
        coordinates.forEach(function (coord) {
          _this2.verticesCount += coord.length;
          _this2.indexCount += coord.length * 2 - 2;
        });
      });
    }
  }, {
    key: "_calculateFeatures",
    value: function _calculateFeatures() {
      var _this3 = this;

      var layerData = this.get('layerData');
      layerData.forEach(function (feature) {
        var coordinates = feature.coordinates;
        coordinates.forEach(function (coord) {
          _this3.verticesCount += coord.length;
          _this3.indexCount += coord.length * 2;
        });
      });
    }
  }, {
    key: "_calculateLine",
    value: function _calculateLine(feature) {
      var _this4 = this;

      var _feature$bufferInfo = feature.bufferInfo,
          indexOffset = _feature$bufferInfo.indexOffset,
          verticesOffset = _feature$bufferInfo.verticesOffset;
      feature.coordinates.forEach(function (coord) {
        var n = coord.length;

        _this4._encodeArray(feature, n);

        for (var i = 0; i < n; i++) {
          _this4.attributes.positions[(verticesOffset + i) * 3] = coord[i][0];
          _this4.attributes.positions[(verticesOffset + i) * 3 + 1] = coord[i][1];
          _this4.attributes.positions[(verticesOffset + i) * 3 + 2] = coord[i][2];
          _this4.indexArray[(indexOffset + i) * 2] = i + verticesOffset * 2;
          _this4.indexArray[(indexOffset + i) * 2 + 1] = i + verticesOffset * 2 + 1;

          if (i === n - 1) {
            _this4.indexArray[(indexOffset + i) * 2 + 1] = verticesOffset + 1;
          }
        }

        verticesOffset += n;
        indexOffset += n;
      });
    }
  }]);

  return LineBuffer;
}(_buffer["default"]);

exports["default"] = LineBuffer;