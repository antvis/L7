"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _layer = _interopRequireDefault(require("../core/layer"));

var _grid = _interopRequireDefault(require("../geom/buffer/heatmap/grid"));

var _gird = _interopRequireDefault(require("./render/heatmap/gird"));

var _hexagon = _interopRequireDefault(require("./render/heatmap/hexagon"));

var _hexagon2 = _interopRequireDefault(require("../geom/buffer/heatmap/hexagon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HeatMapLayer =
/*#__PURE__*/
function (_Layer) {
  _inherits(HeatMapLayer, _Layer);

  function HeatMapLayer() {
    _classCallCheck(this, HeatMapLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(HeatMapLayer).apply(this, arguments));
  }

  _createClass(HeatMapLayer, [{
    key: "shape",
    value: function shape(type) {
      this.shapeType = type;
      return this;
    }
  }, {
    key: "render",
    value: function render() {
      this._prepareRender();

      return this;
    }
  }, {
    key: "_prepareRender",
    value: function _prepareRender() {
      this.init();

      switch (this.shapeType) {
        case 'grid':
          this._drawGrid();

          break;

        case 'hexagon':
          this._drawHexagon();

          break;

        default:
          this._drawGrid();

      }
    }
  }, {
    key: "_drawHexagon",
    value: function _drawHexagon() {
      var style = this.get('styleOptions');
      var radius = this.layerSource.data.radius;
      this._buffer = new _hexagon2.default(this.layerData);

      var config = _objectSpread({}, style, {
        radius: radius
      });

      var Mesh = new _hexagon.default(this._buffer, config);
      this.add(Mesh);
    }
  }, {
    key: "_drawGrid",
    value: function _drawGrid() {
      this.type = 'heatmap';
      var style = this.get('styleOptions');
      var _this$layerSource$dat = this.layerSource.data,
          xOffset = _this$layerSource$dat.xOffset,
          yOffset = _this$layerSource$dat.yOffset;
      this._buffer = new _grid.default(this.layerData);

      var config = _objectSpread({}, style, {
        xOffset: xOffset,
        yOffset: yOffset
      });

      var girdMesh = new _gird.default(this._buffer, config);
      this.add(girdMesh);
    }
  }]);

  return HeatMapLayer;
}(_layer.default);

exports.default = HeatMapLayer;