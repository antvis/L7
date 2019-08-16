"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getRender", {
  enumerable: true,
  get: function get() {
    return _factory.getRender;
  }
});

var _factory = require("./factory");

var _drawFill = _interopRequireDefault(require("./polygon/drawFill"));

var _drawLine = _interopRequireDefault(require("./polygon/drawLine"));

var _drawAnimate = _interopRequireDefault(require("./polygon/drawAnimate"));

var _draw_3d_shape = _interopRequireDefault(require("./point/draw_3d_shape"));

var _drawMeshLine = _interopRequireDefault(require("./line/drawMeshLine"));

var _drawArc = _interopRequireDefault(require("./line/drawArc"));

var _drawImage = _interopRequireDefault(require("./point/drawImage"));

var _drawNormal = _interopRequireDefault(require("./point/drawNormal"));

var _drawStroke = _interopRequireDefault(require("./point/drawStroke"));

var _drawText = _interopRequireDefault(require("./point/drawText"));

var _drawCircle = _interopRequireDefault(require("./point/drawCircle"));

var _hexagon = _interopRequireDefault(require("./heatmap/hexagon"));

var _gird = _interopRequireDefault(require("./heatmap/gird"));

var _heatmap = _interopRequireDefault(require("./heatmap/heatmap"));

var _drawImage2 = _interopRequireDefault(require("./image/drawImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// polygon
(0, _factory.registerRender)('polygon', 'fill', _drawFill["default"]);
(0, _factory.registerRender)('polygon', 'extrude', _drawFill["default"]);
(0, _factory.registerRender)('polygon', 'line', _drawLine["default"]);
(0, _factory.registerRender)('polygon', 'animate', _drawAnimate["default"]); // line

(0, _factory.registerRender)('line', 'line', _drawMeshLine["default"]);
(0, _factory.registerRender)('line', 'arc', _drawArc["default"]);
(0, _factory.registerRender)('line', 'greatCircle', _drawArc["default"]); // point
// import DrawPointFill from './point/drawFill';

// registerRender('point', 'fill', DrawPointFill);
(0, _factory.registerRender)('point', 'image', _drawImage["default"]);
(0, _factory.registerRender)('point', 'normal', _drawNormal["default"]);
(0, _factory.registerRender)('point', 'stroke', _drawStroke["default"]);
(0, _factory.registerRender)('point', 'text', _drawText["default"]);
(0, _factory.registerRender)('point', 'fill', _drawCircle["default"]);
(0, _factory.registerRender)('point', 'shape', _draw_3d_shape["default"]);
(0, _factory.registerRender)('point', 'extrude', _draw_3d_shape["default"]); // heatmap

(0, _factory.registerRender)('heatmap', 'square', _gird["default"]);
(0, _factory.registerRender)('heatmap', 'squareColumn', _gird["default"]);
(0, _factory.registerRender)('heatmap', 'heatmap', _heatmap["default"]);
(0, _factory.registerRender)('heatmap', 'shape', _hexagon["default"]); // image

(0, _factory.registerRender)('image', 'image', _drawImage2["default"]);