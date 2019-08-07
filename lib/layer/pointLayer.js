"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layer = _interopRequireDefault(require("../core/layer"));

var _global = _interopRequireDefault(require("../global"));

var _render = require("./render/");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var pointShape = _global["default"].pointShape;
/**
 * point shape 2d circle, traingle text,image
 * shape 3d   cube，column, sphere
 * shape Model ,自定义
 * image
 */

var PointLayer =
/*#__PURE__*/
function (_Layer) {
  _inherits(PointLayer, _Layer);

  function PointLayer() {
    _classCallCheck(this, PointLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(PointLayer).apply(this, arguments));
  }

  _createClass(PointLayer, [{
    key: "draw",
    value: function draw() {
      this.type = 'point';
      this.shapeType = this._getShape();
      var mesh = (0, _render.getRender)(this.type, this.shapeType)(this.layerData, this, this.layerSource);
      this.add(mesh);
    }
  }, {
    key: "_getShape",
    value: function _getShape() {
      var shape = null;

      if (!this.layerData[0].hasOwnProperty('shape')) {
        return 'normal';
      }

      for (var i = 0; i < this.layerData.length; i++) {
        shape = this.layerData[i].shape;

        if (shape !== undefined) {
          break;
        }
      } // 2D circle 特殊处理


      if (pointShape['2d'].indexOf(shape) !== -1) {
        return 'circle';
      } else if (pointShape['3d'].indexOf(shape) !== -1) {
        return 'fill';
      } else if (this.scene.image.imagesIds.indexOf(shape) !== -1) {
        return 'image';
      }

      return 'text';
    }
  }, {
    key: "zoomchange",
    value: function zoomchange(ev) {
      var _this = this;

      _get(_getPrototypeOf(PointLayer.prototype), "zoomchange", this).call(this, ev);

      requestAnimationFrame(function () {
        _this._updateData();
      });
    }
  }, {
    key: "dragend",
    value: function dragend(ev) {
      var _this2 = this;

      _get(_getPrototypeOf(PointLayer.prototype), "dragend", this).call(this, ev);

      requestAnimationFrame(function () {
        _this2._updateData();
      });
    }
  }, {
    key: "_updateData",
    value: function _updateData() {
      if (this.layerSource.get('isCluster')) {
        var bounds = this.scene.getBounds().toBounds();
        var SW = bounds.getSouthWest();
        var NE = bounds.getNorthEast();
        var zoom = this.scene.getZoom();
        var step = Math.max(NE.lng - SW.lng, NE.lat - SW.lat) / 2;
        var bbox = [SW.lng, SW.lat, NE.lng, NE.lat]; // const bbox = [ SW.lng - step, SW.lat - step, NE.lng + step, NE.lat + step ];

        var cfg = this.layerSource.get('cluster');
        var preBox = cfg.bbox;
        var preZoom = cfg.zoom;

        if (!(preBox && preBox[0] < bbox[0] && preBox[1] < bbox[1] && preBox[2] > bbox[2] && preBox[3] < bbox[3] && // 当前范围在范围内
        Math.abs(zoom - preZoom) < 0.5)) {
          var newbbox = [SW.lng - step, SW.lat - step, NE.lng + step, NE.lat + step];
          this.layerSource.updateCusterData(Math.floor(zoom - 1), newbbox);
          this.repaint();
        }
      }
    }
  }]);

  return PointLayer;
}(_layer["default"]);

exports["default"] = PointLayer;