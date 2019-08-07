"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DrawLine;

var THREE = _interopRequireWildcard(require("../../../core/three"));

var _lineMaterial = require("../../../geom/material/lineMaterial");

var _buffer2 = require("../../../geom/buffer/");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function DrawLine(layerData, layer, buffer) {
  var style = layer.get('styleOptions');
  var animateOptions = layer.get('animateOptions');
  var activeOption = layer.get('activedOptions'); // const pattern = style.pattern;
  // const texture = layer.scene.image.singleImages[pattern];

  var hasPattern = layerData.some(function (layer) {
    return layer.pattern;
  });

  if (!buffer) {
    var geometryBuffer = (0, _buffer2.getBuffer)(layer.type, layer.shapeType);
    buffer = new geometryBuffer({
      layerData: layerData,
      shapeType: 'line',
      style: style,
      imagePos: layer.scene.image.imagePos
    });
  }

  var _buffer = buffer,
      attributes = _buffer.attributes,
      indexArray = _buffer.indexArray;
  var geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
  geometry.addAttribute('a_miter', new THREE.Float32BufferAttribute(attributes.miters, 1));
  geometry.addAttribute('a_distance', new THREE.Float32BufferAttribute(attributes.attrDistance, 1));
  geometry.addAttribute('a_dash_array', new THREE.Float32BufferAttribute(attributes.dashArray, 1));
  geometry.addAttribute('a_texture_coord', new THREE.Float32BufferAttribute(attributes.patterns, 2));
  geometry.addAttribute('a_total_distance', new THREE.Float32BufferAttribute(attributes.totalDistances, 1));
  var lineMaterial = new _lineMaterial.MeshLineMaterial({
    u_opacity: style.opacity,
    u_zoom: layer.scene.getZoom(),
    u_time: 0,
    u_dash_offset: style.dashOffset,
    u_dash_ratio: style.dashRatio,
    activeColor: activeOption.fill,
    u_pattern_spacing: style.patternSpacing || 0,
    u_texture: hasPattern ? layer.scene.image.texture : null
  }, {
    SHAPE: false,
    ANIMATE: false,
    DASHLINE: style.lineType === 'dash',
    TEXTURE: hasPattern
  });
  lineMaterial.setBending(style.blending);
  var lineMesh = new THREE.Mesh(geometry, lineMaterial);

  if (animateOptions.enable) {
    layer.scene.startAnimate();
    var _animateOptions$durat = animateOptions.duration,
        duration = _animateOptions$durat === void 0 ? 2 : _animateOptions$durat,
        _animateOptions$inter = animateOptions.interval,
        interval = _animateOptions$inter === void 0 ? 0.5 : _animateOptions$inter,
        _animateOptions$trail = animateOptions.trailLength,
        trailLength = _animateOptions$trail === void 0 ? 0.5 : _animateOptions$trail,
        _animateOptions$repea = animateOptions.repeat,
        repeat = _animateOptions$repea === void 0 ? Infinity : _animateOptions$repea;
    layer.animateDuration = layer.scene._engine.clock.getElapsedTime() + duration * repeat;
    lineMaterial.updateUninform({
      u_duration: duration,
      u_interval: interval,
      u_trailLength: trailLength
    });
    lineMaterial.setDefinesvalue('ANIMATE', true);
  }

  return lineMesh;
}