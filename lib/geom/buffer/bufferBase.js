"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("../../core/base"));

var THREE = _interopRequireWildcard(require("../../core/three"));

var _normals2 = require("../normals");

var _extrude2 = _interopRequireDefault(require("../extrude"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var BufferBase =
/*#__PURE__*/
function (_Base) {
  _inherits(BufferBase, _Base);

  function BufferBase(cfg) {
    var _this;

    _classCallCheck(this, BufferBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BufferBase).call(this, cfg));
    _this.bufferStruct = {};

    _this.geometryBuffer();

    return _this;
  }

  _createClass(BufferBase, [{
    key: "geometryBuffer",
    value: function geometryBuffer() {}
  }, {
    key: "_normals",
    value: function _normals() {
      var _this$bufferStruct = this.bufferStruct,
          position = _this$bufferStruct.position,
          indices = _this$bufferStruct.indices,
          _this$bufferStruct$no = _this$bufferStruct.normals,
          normals = _this$bufferStruct$no === void 0 ? [] : _this$bufferStruct$no;
      indices.forEach(function (index, i) {
        normals.push((0, _normals2.faceNormals)(index, position[i]));
      });
      this.bufferStruct.normals = normals;
    }
  }, {
    key: "_extrude",
    value: function _extrude(coordinate, heightValue) {
      var extrudeData = (0, _extrude2["default"])(coordinate, heightValue);
      return extrudeData;
    }
  }, {
    key: "_mergeAttributes",
    value: function _mergeAttributes(attributes) {
      var lengths = {}; // Find array lengths

      attributes.forEach(function (_attributes) {
        for (var k in _attributes) {
          if (!lengths[k]) {
            lengths[k] = 0;
          }

          lengths[k] += _attributes[k].length;
        }
      });
      var mergedAttributes = {}; // Set up arrays to merge into

      for (var k in lengths) {
        mergedAttributes[k] = new Float32Array(lengths[k]);
      }

      var lastLengths = {};
      attributes.forEach(function (_attributes) {
        for (var _k in _attributes) {
          if (!lastLengths[_k]) {
            lastLengths[_k] = 0;
          }

          mergedAttributes[_k].set(_attributes[_k], lastLengths[_k]);

          lastLengths[_k] += _attributes[_k].length;
        }
      });
      return mergedAttributes;
    }
  }, {
    key: "_toPolygonAttributes",
    value: function _toPolygonAttributes(polygon) {
      // Three components per vertex per face (3 x 3 = 9)
      var style = polygon.style,
          indices = polygon.indices,
          position = polygon.position,
          indexCount = polygon.indexCount;
      var vertices = new Float32Array(indexCount * 3);
      var normals = new Float32Array(indexCount * 3);
      var colors = new Float32Array(indexCount * 4);
      var pickingIds = new Float32Array(indexCount);
      var pA = new THREE.Vector3();
      var pB = new THREE.Vector3();
      var pC = new THREE.Vector3();
      var cb = new THREE.Vector3();
      var ab = new THREE.Vector3();
      var lastIndex = 0;
      indices.forEach(function (indice, pIndex) {
        for (var i = 0; i < indice.length / 3; i++) {
          var index = indice[i * 3];
          var color = style[pIndex].color;
          var _pickingId = style[pIndex].id;
          var ax = position[pIndex][index][0];
          var ay = position[pIndex][index][1];
          var az = position[pIndex][index][2];
          index = indice[i * 3 + 1];
          var bx = position[pIndex][index][0];
          var by = position[pIndex][index][1];
          var bz = position[pIndex][index][2];
          index = indice[i * 3 + 2];
          var cx = position[pIndex][index][0];
          var cy = position[pIndex][index][1];
          var cz = position[pIndex][index][2];
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
          vertices[lastIndex * 9 + 0] = ax;
          vertices[lastIndex * 9 + 1] = ay;
          vertices[lastIndex * 9 + 2] = az;
          normals[lastIndex * 9 + 0] = nx;
          normals[lastIndex * 9 + 1] = ny;
          normals[lastIndex * 9 + 2] = nz;
          colors[lastIndex * 12 + 0] = color[0];
          colors[lastIndex * 12 + 1] = color[1];
          colors[lastIndex * 12 + 2] = color[2];
          colors[lastIndex * 12 + 3] = color[3];
          vertices[lastIndex * 9 + 3] = bx;
          vertices[lastIndex * 9 + 4] = by;
          vertices[lastIndex * 9 + 5] = bz;
          normals[lastIndex * 9 + 3] = nx;
          normals[lastIndex * 9 + 4] = ny;
          normals[lastIndex * 9 + 5] = nz;
          colors[lastIndex * 12 + 4] = color[0];
          colors[lastIndex * 12 + 5] = color[1];
          colors[lastIndex * 12 + 6] = color[2];
          colors[lastIndex * 12 + 7] = color[3];
          vertices[lastIndex * 9 + 6] = cx;
          vertices[lastIndex * 9 + 7] = cy;
          vertices[lastIndex * 9 + 8] = cz;
          normals[lastIndex * 9 + 6] = nx;
          normals[lastIndex * 9 + 7] = ny;
          normals[lastIndex * 9 + 8] = nz;
          colors[lastIndex * 12 + 8] = color[0];
          colors[lastIndex * 12 + 9] = color[1];
          colors[lastIndex * 12 + 10] = color[2];
          colors[lastIndex * 12 + 11] = color[3];
          pickingIds[lastIndex * 3 + 0] = _pickingId;
          pickingIds[lastIndex * 3 + 1] = _pickingId;
          pickingIds[lastIndex * 3 + 2] = _pickingId;
          lastIndex++;
        }
      });
      var attributes = {
        vertices: vertices,
        normals: normals,
        colors: colors,
        pickingIds: pickingIds,
        faceUv: new Float32Array(polygon.faceUv),
        sizes: new Float32Array(polygon.sizes)
      };
      return attributes;
    }
  }, {
    key: "_toPointShapeAttributes",
    value: function _toPointShapeAttributes(polygon) {
      // Three components per vertex per face (3 x 3 = 9)
      var style = polygon.style,
          indices = polygon.indices,
          position = polygon.position,
          indexCount = polygon.indexCount,
          shapes = polygon.shapes,
          sizes = polygon.sizes;
      var vertices = new Float32Array(indexCount * 3);
      var shapePositions = new Float32Array(indexCount * 3);
      var a_size = new Float32Array(indexCount * 3);
      var normals = new Float32Array(indexCount * 3);
      var colors = new Float32Array(indexCount * 4);
      var pickingIds = new Float32Array(indexCount);
      var pA = new THREE.Vector3();
      var pB = new THREE.Vector3();
      var pC = new THREE.Vector3();
      var cb = new THREE.Vector3();
      var ab = new THREE.Vector3();
      var lastIndex = 0;
      indices.forEach(function (indice, pIndex) {
        for (var i = 0; i < indice.length / 3; i++) {
          var index = indice[i * 3];
          var color = style[pIndex].color;
          var coor1 = position[pIndex];
          var size = sizes[pIndex];
          var _pickingId = style[pIndex].id;
          var ax = shapes[pIndex][index][0];
          var ay = shapes[pIndex][index][1];
          var az = shapes[pIndex][index][2];
          index = indice[i * 3 + 1];
          var bx = shapes[pIndex][index][0];
          var by = shapes[pIndex][index][1];
          var bz = shapes[pIndex][index][2];
          index = indice[i * 3 + 2];
          var cx = shapes[pIndex][index][0];
          var cy = shapes[pIndex][index][1];
          var cz = shapes[pIndex][index][2];
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
          vertices[lastIndex * 9 + 0] = coor1[0];
          vertices[lastIndex * 9 + 1] = coor1[1];
          vertices[lastIndex * 9 + 2] = coor1[2];
          shapePositions[lastIndex * 9 + 0] = ax;
          shapePositions[lastIndex * 9 + 1] = ay;
          shapePositions[lastIndex * 9 + 2] = az;
          a_size[lastIndex * 9 + 0] = size[0];
          a_size[lastIndex * 9 + 1] = size[1];
          a_size[lastIndex * 9 + 2] = size[2];
          normals[lastIndex * 9 + 0] = nx;
          normals[lastIndex * 9 + 1] = ny;
          normals[lastIndex * 9 + 2] = nz;
          colors[lastIndex * 12 + 0] = color[0];
          colors[lastIndex * 12 + 1] = color[1];
          colors[lastIndex * 12 + 2] = color[2];
          colors[lastIndex * 12 + 3] = color[3];
          vertices[lastIndex * 9 + 3] = coor1[0];
          vertices[lastIndex * 9 + 4] = coor1[1];
          vertices[lastIndex * 9 + 5] = coor1[2];
          shapePositions[lastIndex * 9 + 3] = bx;
          shapePositions[lastIndex * 9 + 4] = by;
          shapePositions[lastIndex * 9 + 5] = bz;
          a_size[lastIndex * 9 + 3] = size[0];
          a_size[lastIndex * 9 + 4] = size[1];
          a_size[lastIndex * 9 + 5] = size[2];
          normals[lastIndex * 9 + 3] = nx;
          normals[lastIndex * 9 + 4] = ny;
          normals[lastIndex * 9 + 5] = nz;
          colors[lastIndex * 12 + 4] = color[0];
          colors[lastIndex * 12 + 5] = color[1];
          colors[lastIndex * 12 + 6] = color[2];
          colors[lastIndex * 12 + 7] = color[3];
          vertices[lastIndex * 9 + 6] = coor1[0];
          vertices[lastIndex * 9 + 7] = coor1[1];
          vertices[lastIndex * 9 + 8] = coor1[2];
          a_size[lastIndex * 9 + 6] = size[0];
          a_size[lastIndex * 9 + 7] = size[1];
          a_size[lastIndex * 9 + 8] = size[2];
          shapePositions[lastIndex * 9 + 6] = cx;
          shapePositions[lastIndex * 9 + 7] = cy;
          shapePositions[lastIndex * 9 + 8] = cz;
          normals[lastIndex * 9 + 6] = nx;
          normals[lastIndex * 9 + 7] = ny;
          normals[lastIndex * 9 + 8] = nz;
          colors[lastIndex * 12 + 8] = color[0];
          colors[lastIndex * 12 + 9] = color[1];
          colors[lastIndex * 12 + 10] = color[2];
          colors[lastIndex * 12 + 11] = color[3];
          pickingIds[lastIndex * 3 + 0] = _pickingId;
          pickingIds[lastIndex * 3 + 1] = _pickingId;
          pickingIds[lastIndex * 3 + 2] = _pickingId;
          lastIndex++;
        }
      });
      var attributes = {
        vertices: vertices,
        normals: normals,
        colors: colors,
        pickingIds: pickingIds,
        shapePositions: shapePositions,
        a_size: a_size,
        faceUv: new Float32Array(polygon.faceUv)
      };
      return attributes;
    }
  }, {
    key: "_toPolygonLineAttributes",
    value: function _toPolygonLineAttributes(polygonline) {
      var style = polygonline.style,
          indices = polygonline.indices,
          position = polygonline.position,
          indexCount = polygonline.indexCount;
      var vertices = new Float32Array(indexCount * 3);
      var colors = new Float32Array(indexCount * 4);
      var pickingIds = new Float32Array(indexCount);
      var lastIndex = 0;
      indices.forEach(function (indice, pIndex) {
        for (var i = 0; i < indice.length; i++) {
          var index = indice[i];
          var color = style[pIndex].color;
          var _pickingId = style[pIndex].id;
          vertices[lastIndex * 3] = position[pIndex][index][0];
          vertices[lastIndex * 3 + 1] = position[pIndex][index][1];
          vertices[lastIndex * 3 + 2] = position[pIndex][index][2];
          colors[lastIndex * 4] = color[0];
          colors[lastIndex * 4 + 1] = color[1];
          colors[lastIndex * 4 + 2] = color[2];
          colors[lastIndex * 4 + 3] = color[3];
          pickingIds[lastIndex] = _pickingId;
          lastIndex++;
        }
      });
      var attributes = {
        vertices: vertices,
        colors: colors,
        pickingIds: pickingIds
      };
      return attributes;
    }
  }, {
    key: "_toPointsAttributes",
    value: function _toPointsAttributes(point) {
      var style = point.style,
          position = point.position;
      var count = position.length;
      var vertices = new Float32Array(count * 3);
      var colors = new Float32Array(count * 4);
      var sizes = new Float32Array(count);
      var shapes = new Float32Array(count);
      var pickingIds = new Float32Array(count);
      position.forEach(function (pos, index) {
        vertices[index * 3] = pos[0];
        vertices[index * 3 + 1] = pos[1];
        vertices[index * 3 + 2] = pos[2];
        colors[index * 4] = style[index].color[0];
        colors[index * 4 + 1] = style[index].color[1];
        colors[index * 4 + 2] = style[index].color[2];
        colors[index * 4 + 3] = style[index].color[3];
        pickingIds[index] = style[index].id;
        sizes[index] = style[index].size * window.devicePixelRatio;

        if (style[index].shape) {
          shapes[index] = style[index].shape;
        }
      });
      var attributes = {
        vertices: vertices,
        colors: colors,
        sizes: sizes,
        shapes: shapes,
        pickingIds: pickingIds
      };
      return attributes;
    }
  }, {
    key: "_generateTexture",
    value: function _generateTexture() {
      // build a small canvas 32x64 and paint it in white
      var canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 64;
      var context = canvas.getContext('2d'); // plain it in white

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, 32, 64); // draw the window rows - with a small noise to simulate light variations in each room

      for (var y = 8; y < 64; y += 8) {
        for (var x = 0; x < 32; x += 2) {
          var value = Math.floor(Math.random() * 64);
          context.fillStyle = 'rgb(' + [value, value, value].join(',') + ')';
          context.fillRect(x, y, 2, 4);
        }
      }

      context.fillStyle = '#105CB3';
      context.fillRect(0, 60, 32, 64); // build a bigger canvas and copy the small one in it
      // This is a trick to upscale the texture without filtering

      var canvas2 = document.createElement('canvas');
      canvas2.width = 512;
      canvas2.height = 1024;
      var context2 = canvas2.getContext('2d'); // disable smoothing

      context2.imageSmoothingEnabled = false;
      context2.webkitImageSmoothingEnabled = false;
      context2.mozImageSmoothingEnabled = false; // then draw the image

      context2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height); // return the just built canvas2

      var texture = new THREE.Texture(canvas2); // texture.anisotropy = renderer.getMaxAnisotropy();

      texture.needsUpdate = true;
      return texture;
    }
  }]);

  return BufferBase;
}(_base["default"]);

exports["default"] = BufferBase;