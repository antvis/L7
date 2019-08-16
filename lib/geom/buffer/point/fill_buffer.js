"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = FillBuffer;

var _vertexCompress = require("../../../util/vertex-compress");

var _global = _interopRequireDefault(require("../../../global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var pointShape = _global["default"].pointShape;
var LEFT_SHIFT17 = 131072.0; // const LEFT_SHIFT18 = 262144.0;
// const LEFT_SHIFT19 = 524288.0;
// const LEFT_SHIFT20 = 1048576.0;

var LEFT_SHIFT21 = 2097152.0; // const LEFT_SHIFT22 = 4194304.0;

var LEFT_SHIFT23 = 8388608.0; // const LEFT_SHIFT24 = 16777216.0;

function FillBuffer(data) {
  var index = [];
  var aPosition = [];
  var aPackedData = [];
  var layerData = data.layerData;
  layerData.forEach(function (_ref, i) {
    var _ref$size = _ref.size,
        size = _ref$size === void 0 ? 0 : _ref$size,
        color = _ref.color,
        id = _ref.id,
        coordinates = _ref.coordinates,
        shape = _ref.shape;
    var shapeIndex = pointShape['2d'].indexOf(shape) || 0;
    var newCoord = coordinates;

    if (coordinates.length === 1) {
      newCoord = coordinates[0][0];
    }

    if (isNaN(size)) {
      size = 0;
    } // pack color(vec4) into vec2


    var packedColor = [(0, _vertexCompress.packUint8ToFloat)(color[0] * 255, color[1] * 255), (0, _vertexCompress.packUint8ToFloat)(color[2] * 255, color[3] * 255)]; // construct point coords

    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (extrude) {
      // vec4(color, color, (4-bit extrude, 4-bit shape, 16-bit size), id)
      aPackedData.push.apply(aPackedData, packedColor.concat([(extrude[0] + 1) * LEFT_SHIFT23 + (extrude[1] + 1) * LEFT_SHIFT21 + shapeIndex * LEFT_SHIFT17 + size, id]));
    }); // TODO：如果使用相对瓦片坐标，还可以进一步压缩

    aPosition.push.apply(aPosition, _toConsumableArray(newCoord).concat(_toConsumableArray(newCoord), _toConsumableArray(newCoord), _toConsumableArray(newCoord)));
    index.push.apply(index, _toConsumableArray([0, 1, 2, 0, 2, 3].map(function (n) {
      return n + i * 4;
    })));
  });
  return {
    attributes: {
      aPosition: new Float32Array(aPosition),
      aPackedData: new Float32Array(aPackedData)
    },
    indexArray: new Int32Array(index)
  };
}