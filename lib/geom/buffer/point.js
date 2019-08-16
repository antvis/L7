"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bufferBase = _interopRequireDefault(require("./bufferBase"));

var _index = require("../shape/index");

var polygonPath = _interopRequireWildcard(require("../shape/path"));

var polygonShape = _interopRequireWildcard(require("../shape/polygon"));

var lineShape = _interopRequireWildcard(require("../shape/line"));

var _global = _interopRequireDefault(require("../../global"));

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var pointShape = _global["default"].pointShape;

var PointBuffer =
/*#__PURE__*/
function (_BufferBase) {
  _inherits(PointBuffer, _BufferBase);

  function PointBuffer() {
    _classCallCheck(this, PointBuffer);

    return _possibleConstructorReturn(this, _getPrototypeOf(PointBuffer).apply(this, arguments));
  }

  _createClass(PointBuffer, [{
    key: "geometryBuffer",
    value: function geometryBuffer() {
      var type = this.get('type');

      switch (type) {
        case 'image':
          this._imageBuffer();

          break;

        case '2d':
          this._3dRegularBuffer();

          break;

        case '3d':
          this._3dRegularBuffer();

          break;

        case 'Model':
          this._ModelBuffer();

          break;

        default:
          this._sdfRegularBuffer();

      }
    }
  }, {
    key: "_imageBuffer",
    value: function _imageBuffer() {
      var coordinates = this.get('coordinates');
      var properties = this.get('properties');
      var imagePos = this.get('imagePos');
      var uv = new Float32Array(properties.length * 2);

      for (var i = 0; i < properties.length; i++) {
        var _imagePos$properties$ = imagePos[properties[i].shape],
            x = _imagePos$properties$.x,
            y = _imagePos$properties$.y;
        uv[i * 2] = x;
        uv[i * 2 + 1] = y;
      }

      this.bufferStruct.position = coordinates;
      this.bufferStruct.uv = uv;
      this.bufferStruct.style = properties;
      this.attributes = this._toPointsAttributes(this.bufferStruct);
      this.attributes.uvs = uv;
    }
  }, {
    key: "_sdfRegularBuffer",
    value: function _sdfRegularBuffer() {
      var coordinates = this.get('coordinates');
      var properties = this.get('properties');
      this.bufferStruct.position = coordinates;
      this.bufferStruct.style = properties;
      this.attributes = this._toPointsAttributes(this.bufferStruct);
    }
  }, {
    key: "_3dRegularBuffer",
    value: function _3dRegularBuffer() {
      var _this = this;

      var lineAttribute = {
        shapes: [],
        normal: [],
        miter: [],
        indexArray: [],
        sizes: [],
        positions: []
      };
      var coordinates = this.get('coordinates');
      var properties = this.get('properties');
      var style = this.get('style');
      var type = this.get('type');
      var positions = [];
      var shapes = [];
      var sizes = [];
      var uvs = [];
      var positionsIndex = [];
      var indexCount = 0;
      this.bufferStruct.style = properties;
      coordinates.forEach(function (geo, index) {
        var _lineAttribute$shapes, _lineAttribute$normal, _lineAttribute$miter, _lineAttribute$indexA;

        var _properties$index = properties[index],
            size = _properties$index.size,
            shape = _properties$index.shape; // let shapeType = '';

        if (type === '2d' || type === '3d' && size[2] === 0) {
          // let shapeType = 'fill';
          _util["default"].isArray(size) || (size = [size, size, 0]);
        } else {
          _util["default"].isArray(size) || (size = [size, size, size]);
        }

        if (_index.regularShape[shape] == null) {
          uvs.push(0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0);
          shape = 'square';
        }

        properties[index].size = size;

        var _this$_getShape = _this._getShape(properties[index], style, lineAttribute.miter.length),
            _this$_getShape2 = _slicedToArray(_this$_getShape, 2),
            vert = _this$_getShape2[0],
            polygonLine = _this$_getShape2[1];

        polygonLine.miter.forEach(function () {
          var _lineAttribute$positi, _lineAttribute$sizes;

          (_lineAttribute$positi = lineAttribute.positions).push.apply(_lineAttribute$positi, _toConsumableArray(geo));

          (_lineAttribute$sizes = lineAttribute.sizes).push.apply(_lineAttribute$sizes, _toConsumableArray(size));
        });

        (_lineAttribute$shapes = lineAttribute.shapes).push.apply(_lineAttribute$shapes, _toConsumableArray(polygonLine.positions));

        (_lineAttribute$normal = lineAttribute.normal).push.apply(_lineAttribute$normal, _toConsumableArray(polygonLine.normal));

        (_lineAttribute$miter = lineAttribute.miter).push.apply(_lineAttribute$miter, _toConsumableArray(polygonLine.miter));

        (_lineAttribute$indexA = lineAttribute.indexArray).push.apply(_lineAttribute$indexA, _toConsumableArray(polygonLine.indexArray));

        shapes.push(vert.positions);
        positions.push(geo);
        sizes.push(size);
        positionsIndex.push(vert.positionsIndex);
        indexCount += vert.positionsIndex.length;
      });
      this.bufferStruct.indices = positionsIndex;
      this.bufferStruct.position = positions;
      this.bufferStruct.indexCount = indexCount;
      this.bufferStruct.shapes = shapes;
      this.bufferStruct.sizes = sizes;
      this.bufferStruct.faceUv = uvs;
      this.attributes = this._toPointShapeAttributes(this.bufferStruct);
      this.lineAttribute = lineAttribute;
    }
  }, {
    key: "_getShape",
    value: function _getShape(props, style, positionsIndex) {
      var shape = props.shape;
      var stroke = style.stroke,
          strokeWidth = style.strokeWidth;
      var path = polygonPath[shape]();
      var polygon = null;
      var polygonLine = null;

      if (pointShape['3d'].indexOf(shape) === -1) {
        polygon = polygonShape.fill([path]);
        polygonLine = lineShape.Line(path, {
          size: [strokeWidth, 0],
          color: stroke
        }, positionsIndex);
      } else {
        polygon = polygonShape.extrude([path]);
      }

      return [polygon, polygonLine];
    }
  }]);

  return PointBuffer;
}(_bufferBase["default"]);

exports["default"] = PointBuffer;