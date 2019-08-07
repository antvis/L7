"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = hexagonBuffer;

var _polygon = require("../../shape/polygon");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function hexagonBuffer(layerData) {
  var attribute = {
    vertices: [],
    miter: [],
    colors: [],
    pickingIds: []
  };
  var a = Math.cos(Math.PI / 6);
  var points = [[0, -1, 0], [-a, -0.5, 0], [-a, 0.5, 0], [0, 1, 0], [a, 0.5, 0], [a, -0.5, 0], [0, -1, 0]]; // const hexgonPoints = polygonPath(6);

  var hexgonFill = (0, _polygon.fill)([points]);
  var positionsIndex = hexgonFill.positionsIndex,
      positions = hexgonFill.positions;
  layerData.forEach(function (element) {
    positionsIndex.forEach(function (pointIndex) {
      var _attribute$vertices, _attribute$colors;

      (_attribute$vertices = attribute.vertices).push.apply(_attribute$vertices, _toConsumableArray(element.coordinates));

      attribute.miter.push(positions[pointIndex][0], positions[pointIndex][1]);
      attribute.pickingIds.push(element.id);

      (_attribute$colors = attribute.colors).push.apply(_attribute$colors, _toConsumableArray(element.color));
    });
  });
  return attribute;
}