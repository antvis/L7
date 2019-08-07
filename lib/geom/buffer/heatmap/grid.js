"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = gridBuffer;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function gridBuffer(layerData) {
  var attribute = {
    vertices: [],
    miter: [],
    colors: [],
    pickingIds: []
  };
  layerData.forEach(function (element) {
    var _attribute$colors, _attribute$colors2, _attribute$colors3, _attribute$colors4, _attribute$colors5, _attribute$colors6;

    var color = element.color,
        id = element.id;

    var _element$coordinates = _slicedToArray(element.coordinates, 3),
        x = _element$coordinates[0],
        y = _element$coordinates[1],
        z = _element$coordinates[2];

    attribute.vertices.push(x, y, z);
    attribute.miter.push(-1, -1);
    attribute.vertices.push(x, y, z);
    attribute.miter.push(1, 1);
    attribute.vertices.push(x, y, z);
    attribute.miter.push(-1, 1);
    attribute.vertices.push(x, y, z);
    attribute.miter.push(-1, -1);
    attribute.vertices.push(x, y, z);
    attribute.miter.push(1, -1);
    attribute.vertices.push(x, y, z);
    attribute.miter.push(1, 1);

    (_attribute$colors = attribute.colors).push.apply(_attribute$colors, _toConsumableArray(color));

    (_attribute$colors2 = attribute.colors).push.apply(_attribute$colors2, _toConsumableArray(color));

    (_attribute$colors3 = attribute.colors).push.apply(_attribute$colors3, _toConsumableArray(color));

    (_attribute$colors4 = attribute.colors).push.apply(_attribute$colors4, _toConsumableArray(color));

    (_attribute$colors5 = attribute.colors).push.apply(_attribute$colors5, _toConsumableArray(color));

    (_attribute$colors6 = attribute.colors).push.apply(_attribute$colors6, _toConsumableArray(color));

    attribute.pickingIds.push(id, id, id, id, id, id);
  });
  return attribute;
}