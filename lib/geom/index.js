"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoBuffer = exports.Material = exports.bufferGeometry = void 0;

var bufferGeometry = _interopRequireWildcard(require("./bufferGeometry/index"));

exports.bufferGeometry = bufferGeometry;

var Material = _interopRequireWildcard(require("./material/index"));

exports.Material = Material;

var GeoBuffer = _interopRequireWildcard(require("./buffer/index"));

exports.GeoBuffer = GeoBuffer;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }