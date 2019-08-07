"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = require("../shape/index");

var _bufferBase = _interopRequireDefault(require("./bufferBase"));

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

var polygonLineBuffer =
/*#__PURE__*/
function (_BufferBase) {
  _inherits(polygonLineBuffer, _BufferBase);

  function polygonLineBuffer() {
    _classCallCheck(this, polygonLineBuffer);

    return _possibleConstructorReturn(this, _getPrototypeOf(polygonLineBuffer).apply(this, arguments));
  }

  _createClass(polygonLineBuffer, [{
    key: "geometryBuffer",
    value: function geometryBuffer() {
      var coordinates = this.get('coordinates');
      var properties = this.get('properties');
      var shape = this.get('shape');
      var positions = [];
      var positionsIndex = [];
      var vertsCount = 0;
      this.bufferStruct.style = properties;
      var isExtrude = properties[0].hasOwnProperty('size');
      coordinates.forEach(function (geo, index) {
        var heightValue = properties[index].size;
        var extrudeData = [];

        if (isExtrude && shape === 'extrudeline') {
          extrudeData = _index.polygonShape.extrudeline(geo);
          extrudeData.positions = extrudeData.positions.map(function (pos) {
            pos[2] *= heightValue;
            return pos;
          });
        } else {
          extrudeData = _index.polygonShape.line(geo);
        }

        positions.push(extrudeData.positions);
        positionsIndex.push.apply(positionsIndex, _toConsumableArray(extrudeData.positionsIndex.map(function (index) {
          return index + vertsCount;
        })));
        vertsCount += extrudeData.positions.length;
      });
      this.bufferStruct.indexs = positionsIndex;
      this.bufferStruct.verts = positions;
      this.bufferStruct.vertsCount = vertsCount;
    }
  }]);

  return polygonLineBuffer;
}(_bufferBase["default"]);

exports["default"] = polygonLineBuffer;