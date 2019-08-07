"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _buffer = _interopRequireDefault(require("../buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Grid3D =
/*#__PURE__*/
function (_BufferBase) {
  _inherits(Grid3D, _BufferBase);

  function Grid3D() {
    _classCallCheck(this, Grid3D);

    return _possibleConstructorReturn(this, _getPrototypeOf(Grid3D).apply(this, arguments));
  }

  _createClass(Grid3D, [{
    key: "_buildFeatures",
    value: function _buildFeatures() {
      var _this = this;

      var layerData = this.get('layerData');
      this._offset = 0;
      var shapeType = this.get('shapeType');
      layerData.forEach(function (feature) {
        _this._calculateTop(feature);

        if (shapeType === 'squareColumn') {
          _this._calculateWall(feature);
        }

        delete feature.bufferInfo;
      });
    }
  }, {
    key: "_initAttributes",
    value: function _initAttributes() {
      _get(_getPrototypeOf(Grid3D.prototype), "_initAttributes", this).call(this);

      this.attributes.miters = new Float32Array(this.verticesCount * 3);
      this.attributes.normals = new Float32Array(this.verticesCount * 3);
    }
  }, {
    key: "_calculateFeatures",
    value: function _calculateFeatures() {
      var layerData = this.get('layerData');
      var shapeType = this.get('shapeType');

      if (shapeType === 'squareColumn') {
        this.verticesCount = layerData.length * 20;
      } else {
        this.verticesCount = layerData.length * 4;
      }

      this.indexCount = this.verticesCount * 1.5;
    }
  }, {
    key: "_calculateTop",
    value: function _calculateTop(feature) {
      var _this2 = this;

      var _feature$coordinates = _slicedToArray(feature.coordinates, 2),
          x = _feature$coordinates[0],
          y = _feature$coordinates[1];

      var size = feature.size;
      feature.bufferInfo = {
        verticesOffset: this._offset
      };
      var shapeType = this.get('shapeType');

      if (shapeType !== 'squareColumn') {
        size = 0;
      }

      this._encodeArray(feature, 4);

      this.attributes.positions.set([x, y, size, x, y, size, x, y, size, x, y, size], this._offset * 3);
      this.attributes.miters.set([-1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1], this._offset * 3);
      this.attributes.normals.set([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], this._offset * 3); // top normal

      var indexArray = [0, 2, 1, 2, 3, 1].map(function (v) {
        return v + _this2._offset;
      });
      this.indexArray.set(indexArray, this._offset * 1.5);
      this._offset += 4;
    }
  }, {
    key: "_calculateWall",
    value: function _calculateWall(feature) {
      var size = feature.size;

      var _feature$coordinates2 = _slicedToArray(feature.coordinates, 2),
          x = _feature$coordinates2[0],
          y = _feature$coordinates2[1];

      var vertices = [1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1];
      feature.bufferInfo = {
        verticesOffset: this._offset
      };

      this._encodeArray(feature, 20); // front left, back right


      this.attributes.normals.set([0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // bottom
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // left
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // top
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0 // right
      ], this._offset * 3); // top normal

      for (var i = 0; i < 4; i++) {
        this.attributes.positions.set([x, y, 1, x, y, 1, x, y, 1, x, y, 1], this._offset * 3);
        var prePoint = vertices.slice(i * 3, i * 3 + 3);
        var nextPoint = vertices.slice(i * 3 + 3, i * 3 + 6);

        this._calculateExtrudeFace(prePoint, nextPoint, this._offset, this._offset * 1.5, size);

        this._offset += 4;
      }
    }
  }, {
    key: "_calculateExtrudeFace",
    value: function _calculateExtrudeFace(prePoint, nextPoint, positionOffset, indexOffset, size) {
      this.attributes.miters.set([prePoint[0], prePoint[1], size, nextPoint[0], nextPoint[1], size, prePoint[0], prePoint[1], 0, nextPoint[0], nextPoint[1], 0], positionOffset * 3);
      var indexArray = [0, 1, 2, 1, 3, 2].map(function (v) {
        return v + positionOffset;
      });

      if (this.get('uv')) {
        // temp  点亮城市demo
        this.attributes.uv.set([0.1, 0, 0, 0, 0.1, size / 2000, 0, size / 2000], positionOffset * 2);
      }

      this.indexArray.set(indexArray, indexOffset);
    }
  }]);

  return Grid3D;
}(_buffer["default"]);

exports["default"] = Grid3D;