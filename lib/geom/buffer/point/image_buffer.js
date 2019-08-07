"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ImageBuffer;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ImageBuffer(layerData, opt) {
  var attributes = {
    vertices: [],
    colors: [],
    sizes: [],
    shapes: [],
    pickingIds: [],
    uv: []
  };
  layerData.forEach(function (item) {
    var _attributes$vertices, _attributes$colors;

    var color = item.color,
        size = item.size,
        id = item.id,
        shape = item.shape,
        coordinates = item.coordinates;
    var _opt$imagePos$shape = opt.imagePos[shape],
        x = _opt$imagePos$shape.x,
        y = _opt$imagePos$shape.y;

    (_attributes$vertices = attributes.vertices).push.apply(_attributes$vertices, _toConsumableArray(coordinates));

    (_attributes$colors = attributes.colors).push.apply(_attributes$colors, _toConsumableArray(color));

    attributes.pickingIds.push(id);
    attributes.sizes.push(size * window.devicePixelRatio); //

    attributes.uv.push(x, y);
    attributes.shapes.push(shape);
  });
  return attributes;
}