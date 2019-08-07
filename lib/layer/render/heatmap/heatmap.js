"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DrawHeatmap;

var _heatmap = _interopRequireWildcard(require("../../../geom/buffer/heatmap/heatmap"));

var _heatmapMaterial = require("../../../geom/material/heatmapMaterial");

var _renderPass = _interopRequireDefault(require("../../../core/engine/render-pass"));

var _shaderPass = _interopRequireDefault(require("../../../core/engine/shader-pass"));

var _effectComposer = _interopRequireDefault(require("../../../core/engine/effect-composer"));

var THREE = _interopRequireWildcard(require("../../../core/three"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

// import Renderpass from '../../../core/engine/renderpass.bak';
function DrawHeatmap(layerdata, layer) {
  var colors = layer.get('styleOptions').rampColors;
  layer.rampColors = (0, _heatmap.createColorRamp)(colors);
  var heatmap = new heatmapPass(layerdata, layer);
  var copy = new copyPass(layer);
  copy.renderToScreen = true;
  var composer = new _effectComposer["default"](layer.scene._engine._renderer, layer.scene._container);
  composer.addPass(heatmap);
  composer.addPass(copy);

  layer.scene._engine.update();

  layer._updateStyle = function (style) {
    if (style.rampColors) {
      style.rampColors = (0, _heatmap.createColorRamp)(style.rampColors);
    }

    var newOption = {};

    for (var key in style) {
      newOption['u_' + key] = style[key];
    }

    heatmap.scene.children[0].material.updateUninform(newOption);
    copy.scene.children[0].material.updateUninform(newOption);
  };

  return composer;
}

function heatmapPass(layerdata, layer) {
  var scene = new THREE.Scene();
  var style = layer.get('styleOptions');
  var data = layerdata;
  var camera = layer.scene._engine._camera; // get attributes data

  var buffer = new _heatmap["default"]({
    data: data
  });
  var attributes = buffer.attributes; // create geometery

  var geometry = new THREE.BufferGeometry(); // geometry.setIndex(attributes.indices);

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_dir', new THREE.Float32BufferAttribute(attributes.dirs, 2));
  geometry.addAttribute('a_weight', new THREE.Float32BufferAttribute(attributes.weights, 1));
  var material = new _heatmapMaterial.HeatmapIntensityMaterial({
    u_intensity: style.intensity,
    u_radius: style.radius,
    u_zoom: layer.scene.getZoom()
  }, {});
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  scene.onBeforeRender = function () {
    // 每次渲染前改变状态
    var zoom = layer.scene.getZoom();
    mesh.material.setUniformsValue('u_zoom', zoom);
  };

  var pass = new _renderPass["default"](scene, camera);
  return pass;
}

function copyPass(layer) {
  var style = layer.get('styleOptions');
  var material = new _heatmapMaterial.HeatmapColorizeMaterial({
    u_rampColors: layer.rampColors,
    u_opacity: style.opacity || 1.0
  }, {});
  var copyPass = new _shaderPass["default"](material, 'u_texture');
  return copyPass;
}