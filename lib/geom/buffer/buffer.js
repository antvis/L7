"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("../../core/base"));

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

var BufferBase =
/*#__PURE__*/
function (_Base) {
  _inherits(BufferBase, _Base);

  function BufferBase(cfg) {
    var _this;

    _classCallCheck(this, BufferBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BufferBase).call(this, cfg));
    _this.attributes = {};
    _this.verticesCount = 0;
    _this.indexCount = 0;
    _this.indexArray = new Int32Array(0);

    _this._init();

    return _this;
  }

  _createClass(BufferBase, [{
    key: "_init",
    value: function _init() {
      this._calculateFeatures();

      this._initAttributes();

      this._buildFeatures();
    }
  }, {
    key: "_initAttributes",
    value: function _initAttributes() {
      this.attributes.positions = new Float32Array(this.verticesCount * 3);
      this.attributes.colors = new Float32Array(this.verticesCount * 4);
      this.attributes.pickingIds = new Float32Array(this.verticesCount);
      this.attributes.sizes = new Float32Array(this.verticesCount);
      this.attributes.pickingIds = new Float32Array(this.verticesCount);

      if (this.get('uv')) {
        this.attributes.uv = new Float32Array(this.verticesCount * 2);
      }

      this.indexArray = new Int32Array(this.indexCount);
    }
  }, {
    key: "addFeature",
    value: function addFeature() {} // 更新渲染

  }, {
    key: "upload",
    value: function upload() {}
  }, {
    key: "destroy",
    value: function destroy() {}
  }, {
    key: "resize",
    value: function resize() {}
  }, {
    key: "checkIsClosed",
    value: function checkIsClosed(points) {
      var p1 = points[0][0];
      var p2 = points[0][points[0].length - 1];
      return p1[0] === p2[0] && p1[1] === p2[1];
    }
  }, {
    key: "concat",
    value: function concat(arrayType, arrays) {
      var totalLength = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = arrays[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var arr = _step.value;
          totalLength += arr.length;
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

      var arrayBuffer = new ArrayBuffer(totalLength * arrayType.BYTES_PER_ELEMENT);
      var offset = 0;
      var result = new arrayType(arrayBuffer);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = arrays[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _arr = _step2.value;
          result.set(_arr, offset);
          offset += _arr.length;
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

      return result;
    }
  }, {
    key: "_encodeArray",
    value: function _encodeArray(feature, num) {
      var color = feature.color,
          id = feature.id,
          pattern = feature.pattern,
          size = feature.size;
      var verticesOffset = feature.bufferInfo.verticesOffset;
      var imagePos = this.get('imagePos');
      var start1 = verticesOffset;

      for (var i = 0; i < num; i++) {
        if (feature.hasOwnProperty('color')) {
          this.attributes.colors[start1 * 4 + i * 4] = color[0];
          this.attributes.colors[start1 * 4 + i * 4 + 1] = color[1];
          this.attributes.colors[start1 * 4 + i * 4 + 2] = color[2];
          this.attributes.colors[start1 * 4 + i * 4 + 3] = color[3];
        }

        if (feature.hasOwnProperty('id')) {
          this.attributes.pickingIds[start1 + i] = id;
        }

        if (feature.hasOwnProperty('size')) {
          var size2 = size;

          if (Array.isArray(size) && size.length === 2) {
            size2 = [size[0]];
          }

          if (!Array.isArray(size)) {
            size2 = [size];
          }

          this.attributes.sizes.set(size2, (start1 + i) * size2.length);
        }

        if (feature.hasOwnProperty('pattern')) {
          var patternPos = imagePos[pattern] || {
            x: 0,
            y: 0
          };
          this.attributes.patterns[start1 * 2 + i * 2] = patternPos.x;
          this.attributes.patterns[start1 * 2 + i * 2 + 1] = patternPos.y;
        }
      }
    }
  }, {
    key: "_calculateWall",
    value: function _calculateWall(feature) {
      var size = feature.size;
      var _feature$bufferInfo = feature.bufferInfo,
          vertices = _feature$bufferInfo.vertices,
          indexOffset = _feature$bufferInfo.indexOffset,
          verticesOffset = _feature$bufferInfo.verticesOffset,
          faceNum = _feature$bufferInfo.faceNum;

      this._encodeArray(feature, faceNum * 4);

      for (var i = 0; i < faceNum; i++) {
        var prePoint = vertices.slice(i * 3, i * 3 + 3);
        var nextPoint = vertices.slice(i * 3 + 3, i * 3 + 6);

        this._calculateExtrudeFace(prePoint, nextPoint, verticesOffset + i * 4, indexOffset + i * 6, size);

        feature.bufferInfo.verticesOffset += 4;
        feature.bufferInfo.indexOffset += 6;
      }
    }
  }, {
    key: "_calculateExtrudeFace",
    value: function _calculateExtrudeFace(prePoint, nextPoint, positionOffset, indexOffset, size) {
      this.attributes.positions.set([prePoint[0], prePoint[1], size, nextPoint[0], nextPoint[1], size, prePoint[0], prePoint[1], 0, nextPoint[0], nextPoint[1], 0], positionOffset * 3);
      var indexArray = [1, 2, 0, 3, 2, 1].map(function (v) {
        return v + positionOffset;
      });

      if (this.get('uv')) {
        this.attributes.uv.set([0.1, 0, 0, 0, 0.1, size / 2000, 0, size / 2000], positionOffset * 2);
      }

      this.indexArray.set(indexArray, indexOffset);
    }
  }]);

  return BufferBase;
}(_base["default"]);

exports["default"] = BufferBase;