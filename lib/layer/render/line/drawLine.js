"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DrawLine;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var _lineMaterial = require("../../../geom/material/lineMaterial");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function DrawLine(attributes, style) {
  var opacity = style.opacity,
      zoom = style.zoom,
      animate = style.animate,
      duration = style.duration,
      interval = style.interval,
      trailLength = style.trailLength;
  var geometry = new THREE.BufferGeometry();
  geometry.setIndex(attributes.indexArray);
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normal, 3));
  geometry.addAttribute('a_miter', new THREE.Float32BufferAttribute(attributes.miter, 1));
  geometry.addAttribute('a_distance', new THREE.Float32BufferAttribute(attributes.attrDistance, 1));
  var lineMaterial = new _lineMaterial.MeshLineMaterial({
    u_opacity: opacity,
    u_zoom: zoom,
    u_duration: duration,
    u_interval: interval,
    u_trailLength: trailLength,
    u_time: 0
  }, {
    SHAPE: false,
    ANIMATE: animate
  });
  var arcMesh = new THREE.Mesh(geometry, lineMaterial);
  return arcMesh;
}