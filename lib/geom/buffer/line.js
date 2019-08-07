"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bufferBase = _interopRequireDefault(require("./bufferBase"));

var _shape = require("../shape");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
    key: "geometryBuffer",
    value: function geometryBuffer() {
      var shapeType = this.shapeType = this.get('shapeType');

      if (shapeType === 'line') {
        this.attributes = this._getMeshLineAttributes();
        return;
      } else if (shapeType === 'arc') {
        this.attributes = this._getArcLineAttributes();
        return;
      }
    }
  }, {
    key: "_getShape",
    value: function _getShape(geo, props, index) {
      if (!this.shapeType) {
        return _shape.lineShape.defaultLine(geo, index);
      }

      var shape = this.shapeType;

      if (shape === 'meshLine') {
        return _shape.lineShape[shape](geo, props, index);
      } else if (shape === 'tubeLine') {
        return _shape.lineShape[shape](geo, props, index);
      } else if (shape === 'arc') {
        return _shape.lineShape[shape](geo, props, index);
      }

      return _shape.lineShape.Line(geo, props, index);
    }
  }, {
    key: "_getArcLineAttributes",
    value: function _getArcLineAttributes() {
      var _this = this;

      var layerData = this.get('layerData');
      var positions = [];
      var colors = [];
      var indexArray = [];
      var sizes = [];
      var instances = [];
      var pickingIds = [];
      layerData.forEach(function (item) {
        var props = item;
        var positionCount = positions.length / 3;

        var attrData = _this._getShape(item.coordinates, props, positionCount);

        positions.push.apply(positions, _toConsumableArray(attrData.positions));
        colors.push.apply(colors, _toConsumableArray(attrData.colors));
        indexArray.push.apply(indexArray, _toConsumableArray(attrData.indexArray));
        instances.push.apply(instances, _toConsumableArray(attrData.instances));
        sizes.push.apply(sizes, _toConsumableArray(attrData.sizes));
        pickingIds.push.apply(pickingIds, _toConsumableArray(attrData.pickingIds));
      });
      return {
        pickingIds: pickingIds,
        positions: positions,
        colors: colors,
        indexArray: indexArray,
        sizes: sizes,
        instances: instances
      };
    }
  }, {
    key: "_getMeshLineAttributes",
    value: function _getMeshLineAttributes() {
      var layerData = this.get('layerData');

      var _this$get = this.get('style'),
          dashArray = _this$get.dashArray;

      var imagePos = this.get('imagePos');
      var positions = [];
      var pickingIds = [];
      var normal = [];
      var miter = [];
      var colors = [];
      var indexArray = [];
      var sizes = [];
      var attrDistance = [];
      var attrDashArray = [];
      var textureCoord = [];
      var totalDistance = [];
      layerData.forEach(function (item) {
        var props = item;
        var positionCount = positions.length / 3;
        var patternPos = {
          x: 0,
          y: 0
        };

        if (item.pattern && imagePos[item.pattern]) {
          patternPos = imagePos[item.pattern];
        }

        var attr = _shape.lineShape.Line(item.coordinates, props, positionCount, dashArray, patternPos);

        positions.push.apply(positions, _toConsumableArray(attr.positions));
        normal.push.apply(normal, _toConsumableArray(attr.normal));
        miter.push.apply(miter, _toConsumableArray(attr.miter));
        colors.push.apply(colors, _toConsumableArray(attr.colors));
        indexArray.push.apply(indexArray, _toConsumableArray(attr.indexArray));
        sizes.push.apply(sizes, _toConsumableArray(attr.sizes));
        attrDistance.push.apply(attrDistance, _toConsumableArray(attr.attrDistance));
        pickingIds.push.apply(pickingIds, _toConsumableArray(attr.pickingIds));
        attrDashArray.push.apply(attrDashArray, _toConsumableArray(attr.dashArray));
        textureCoord.push.apply(textureCoord, _toConsumableArray(attr.textureCoordArray));
        totalDistance.push.apply(totalDistance, _toConsumableArray(attr.totalDistances));
      });
      return {
        positions: positions,
        normal: normal,
        miter: miter,
        colors: colors,
        indexArray: indexArray,
        pickingIds: pickingIds,
        sizes: sizes,
        attrDistance: attrDistance,
        attrDashArray: attrDashArray,
        textureCoord: textureCoord,
        totalDistance: totalDistance
      };
    }
  }]);

  return LineBuffer;
}(_bufferBase["default"]);

exports["default"] = LineBuffer;