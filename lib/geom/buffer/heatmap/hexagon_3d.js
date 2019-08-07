"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _buffer = _interopRequireDefault(require("../buffer"));

var _extrude = require("../../extrude");

var _global = _interopRequireDefault(require("../../../global"));

var shapePath = _interopRequireWildcard(require("../../shape/path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var Hexagon3D =
/*#__PURE__*/
function (_BufferBase) {
  _inherits(Hexagon3D, _BufferBase);

  function Hexagon3D() {
    _classCallCheck(this, Hexagon3D);

    return _possibleConstructorReturn(this, _getPrototypeOf(Hexagon3D).apply(this, arguments));
  }

  _createClass(Hexagon3D, [{
    key: "_buildFeatures",
    value: function _buildFeatures() {
      var _this = this;

      var layerData = this.get('layerData');
      this._offset = 0;
      layerData.forEach(function (feature) {
        _this._calculateFill(feature);
      });
    }
  }, {
    key: "_calculateFeatures",
    value: function _calculateFeatures() {
      var shape = this.get('shapeType');
      var hexgonFill = this.getShape(shape);
      var layerData = this.get('layerData');
      this.verticesCount = layerData.length;
      this.indexCount = 0;
      this.instanceGeometry = hexgonFill;
    }
  }, {
    key: "_calculateFill",
    value: function _calculateFill(feature) {
      feature.bufferInfo = {
        verticesOffset: this._offset
      };
      var coordinates = feature.coordinates;

      this._encodeArray(feature, 1);

      this.attributes.positions.set(coordinates, this._offset * 3);
      this._offset++;
    }
  }, {
    key: "getShape",
    value: function getShape(shape) {
      var pointShape = _global["default"].pointShape;
      if (pointShape['3d'].indexOf(shape) !== -1) return (0, _extrude.extrude_Polygon)([shapePath[shape]()]);
      if (pointShape['2d'].indexOf(shape) !== -1) return (0, _extrude.fillPolygon)([shapePath[shape]()]);
      return (0, _extrude.fillPolygon)([shapePath[shape]()]);
    }
  }]);

  return Hexagon3D;
}(_buffer["default"]);

exports["default"] = Hexagon3D;