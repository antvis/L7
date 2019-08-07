"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = StrokeBuffer;

var polygonPath = _interopRequireWildcard(require("../../shape/path"));

var polygonShape = _interopRequireWildcard(require("../../shape/polygon"));

var lineShape = _interopRequireWildcard(require("../../shape/line"));

var _global = _interopRequireDefault(require("../../../global"));

var _util = _interopRequireDefault(require("../../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var pointShape = _global["default"].pointShape;

function StrokeBuffer(layerData, style) {
  var attribute = {
    shapes: [],
    normal: [],
    miter: [],
    indexArray: [],
    sizes: [],
    positions: [],
    pickingIds: [],
    colors: []
  };
  var stroke = style.stroke,
      strokeWidth = style.strokeWidth;
  layerData.forEach(function (item) {
    var size = item.size,
        shape = item.shape,
        id = item.id,
        coordinates = item.coordinates;
    var path = polygonPath[shape]();
    var positionsIndex = attribute.miter.length;
    var polygon = null;

    if (pointShape['2d'].indexOf(shape) !== -1) {
      _util["default"].isArray(size) || (size = [size, size, 0]);
      polygon = lineShape.Line([path], {
        size: [strokeWidth, 0],
        color: stroke,
        id: id
      }, positionsIndex);
    } else if (pointShape['3d'].indexOf(shape) !== -1) {
      _util["default"].isArray(size) || (size = [size, size, size]);
      var polygonExtrudePath = polygonShape.extrudeline([path]); // TODO 3d line

      polygon = lineShape.Line([polygonExtrudePath], {
        size: [strokeWidth, 0],
        color: stroke,
        id: id
      }, positionsIndex);
    } else {
      throw new Error('Invalid shape type: ' + shape);
    }

    polygonLineBuffer(polygon, coordinates, size, attribute);
  });
  return attribute;
}

function polygonLineBuffer(polygon, geo, size, attribute) {
  var _attribute$shapes, _attribute$normal, _attribute$miter, _attribute$pickingIds, _attribute$indexArray, _attribute$colors;

  (_attribute$shapes = attribute.shapes).push.apply(_attribute$shapes, _toConsumableArray(polygon.positions));

  (_attribute$normal = attribute.normal).push.apply(_attribute$normal, _toConsumableArray(polygon.normal));

  (_attribute$miter = attribute.miter).push.apply(_attribute$miter, _toConsumableArray(polygon.miter));

  (_attribute$pickingIds = attribute.pickingIds).push.apply(_attribute$pickingIds, _toConsumableArray(polygon.pickingIds));

  (_attribute$indexArray = attribute.indexArray).push.apply(_attribute$indexArray, _toConsumableArray(polygon.indexArray));

  (_attribute$colors = attribute.colors).push.apply(_attribute$colors, _toConsumableArray(polygon.colors));

  polygon.miter.forEach(function () {
    var _attribute$positions, _attribute$sizes;

    (_attribute$positions = attribute.positions).push.apply(_attribute$positions, _toConsumableArray(geo)); // 多边形位置


    (_attribute$sizes = attribute.sizes).push.apply(_attribute$sizes, _toConsumableArray(size)); // 多边形大小

  });
}