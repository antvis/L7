"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _util = _interopRequireDefault(require("../util"));

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

var Position =
/*#__PURE__*/
function (_Base) {
  _inherits(Position, _Base);

  function Position(cfg) {
    var _this;

    _classCallCheck(this, Position);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Position).call(this, cfg));
    _this.names = ['x', 'y'];
    _this.type = 'position';
    return _this;
  }

  _createClass(Position, [{
    key: "mapping",
    value: function mapping(x, y) {
      var scales = this.scales;
      var coord = this.coord;
      var scaleX = scales[0];
      var scaleY = scales[1];
      var rstX;
      var rstY;
      var obj;

      if (_util["default"].isNil(x) || _util["default"].isNil(y)) {
        return [];
      }

      if (_util["default"].isArray(y) && _util["default"].isArray(x)) {
        rstX = [];
        rstY = [];

        for (var i = 0, j = 0; i < x.length && j < y.length; i++, j++) {
          obj = coord.convertPoint({
            x: scaleX.scale(x[i]),
            y: scaleY.scale(y[j])
          });
          rstX.push(obj.x);
          rstY.push(obj.y);
        }
      } else if (_util["default"].isArray(y)) {
        x = scaleX.scale(x);
        rstY = [];

        _util["default"].each(y, function (yVal) {
          yVal = scaleY.scale(yVal);
          obj = coord.convertPoint({
            x: x,
            y: yVal
          });

          if (rstX && rstX !== obj.x) {
            if (!_util["default"].isArray(rstX)) {
              rstX = [rstX];
            }

            rstX.push(obj.x);
          } else {
            rstX = obj.x;
          }

          rstY.push(obj.y);
        });
      } else if (_util["default"].isArray(x)) {
        y = scaleY.scale(y);
        rstX = [];

        _util["default"].each(x, function (xVal) {
          xVal = scaleX.scale(xVal);
          obj = coord.convertPoint({
            x: xVal,
            y: y
          });

          if (rstY && rstY !== obj.y) {
            if (!_util["default"].isArray(rstY)) {
              rstY = [rstY];
            }

            rstY.push(obj.y);
          } else {
            rstY = obj.y;
          }

          rstX.push(obj.x);
        });
      } else {
        x = scaleX.scale(x);
        y = scaleY.scale(y);
        var point = coord.convertPoint({
          x: x,
          y: y
        });
        rstX = point.x;
        rstY = point.y;
      }

      return [rstX, rstY];
    }
  }]);

  return Position;
}(_base["default"]);

var _default = Position;
exports["default"] = _default;