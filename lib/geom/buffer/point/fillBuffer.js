"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = fillBuffer;

var _global = _interopRequireDefault(require("../../../global"));

var THREE = _interopRequireWildcard(require("../../../core/three"));

var polygonShape = _interopRequireWildcard(require("../../shape/polygon"));

var polygonPath = _interopRequireWildcard(require("../../shape/path"));

var _util = _interopRequireDefault(require("../../../util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var pointShape = _global["default"].pointShape;

function fillBuffer(layerData) {
  var attribute = {
    vertices: [],
    normals: [],
    colors: [],
    pickingIds: [],
    shapePositions: [],
    a_size: [],
    faceUv: []
  };
  layerData.forEach(function (item) {
    var size = item.size,
        shape = item.shape,
        color = item.color,
        id = item.id,
        coordinates = item.coordinates;
    var polygon = null;
    var path = polygonPath[shape]();

    if (pointShape['2d'].indexOf(shape) !== -1) {
      _util["default"].isArray(size) || (size = [size, size, 0]);
      polygon = polygonShape.fill([path]);
    } else if (pointShape['3d'].indexOf(shape) !== -1) {
      _util["default"].isArray(size) || (size = [size, size, size]);
      polygon = polygonShape.extrude([path]);
    } else {
      throw new Error('Invalid shape type: ' + shape);
    }

    toPointShapeAttributes(polygon, coordinates, {
      size: size,
      shape: shape,
      color: color,
      id: id
    }, attribute); // toPointShapeAttributes(polygon, null, {}, attribute);
    // instanced attributes
    // attribute.vertices.push(...coordinates);
    // attribute.a_size.push(...size);
    // attribute.colors.push(...color);
    // attribute.pickingIds.push(id);
  });
  return attribute;
}

function toPointShapeAttributes(polygon, geo, style, attribute) {
  var positionsIndex = polygon.positionsIndex,
      positions = polygon.positions;
  var pA = new THREE.Vector3();
  var pB = new THREE.Vector3();
  var pC = new THREE.Vector3();
  var cb = new THREE.Vector3();
  var ab = new THREE.Vector3();

  for (var i = 0; i < positionsIndex.length / 3; i++) {
    var _attribute$vertices, _attribute$a_size, _attribute$colors;

    var index = positionsIndex[i * 3];
    var color = style.color,
        size = style.size,
        id = style.id;
    var ax = positions[index][0];
    var ay = positions[index][1];
    var az = positions[index][2];
    index = positionsIndex[i * 3 + 1];
    var bx = positions[index][0];
    var by = positions[index][1];
    var bz = positions[index][2];
    index = positionsIndex[i * 3 + 2];
    var cx = positions[index][0];
    var cy = positions[index][1];
    var cz = positions[index][2];
    pA.set(ax, ay, az);
    pB.set(bx, by, bz);
    pC.set(cx, cy, cz);
    cb.subVectors(pC, pB);
    ab.subVectors(pA, pB);
    cb.cross(ab);
    cb.normalize();
    var nx = cb.x;
    var ny = cb.y;
    var nz = cb.z;

    (_attribute$vertices = attribute.vertices).push.apply(_attribute$vertices, _toConsumableArray(geo).concat(_toConsumableArray(geo), _toConsumableArray(geo)));

    attribute.shapePositions.push(ax, ay, az, bx, by, bz, cx, cy, cz);

    (_attribute$a_size = attribute.a_size).push.apply(_attribute$a_size, _toConsumableArray(size).concat(_toConsumableArray(size), _toConsumableArray(size)));

    attribute.normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);

    (_attribute$colors = attribute.colors).push.apply(_attribute$colors, _toConsumableArray(color).concat(_toConsumableArray(color), _toConsumableArray(color)));

    attribute.pickingIds.push(id, id, id); // attribute.shapePositions.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    // attribute.normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
  }
}