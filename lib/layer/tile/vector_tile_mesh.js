"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _object3dUtil = require("../../util/object3d-util");

var THREE = _interopRequireWildcard(require("../../core/three"));

var _maskMaterial = _interopRequireDefault(require("../../geom/material/tile/maskMaterial"));

var _geoCoord = require("@antv/geo-coord");

var _index = require("../render/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var r2d = 180 / Math.PI;

var VectorTileMesh =
/*#__PURE__*/
function () {
  function VectorTileMesh(layer, data) {
    _classCallCheck(this, VectorTileMesh);

    this.layer = layer;
    this._object3D = new THREE.Object3D();
    this._object3D.name = data.tileId;
    this._tile = data.tileId.split('_').map(function (v) {
      return v * 1;
    });
    this._tileLnglatBounds = this._tileLnglatBounds(this._tile);
    this._tileBounds = this._tileBounds(this._tileLnglatBounds);
    this._center = this._tileBounds.getCenter();
    this._centerLnglat = this._tileLnglatBounds.getCenter();

    this._init(data);

    this.maskScene = new THREE.Scene();

    var tileMesh = this._tileMaskMesh(); // this._object3D.add(tileMesh);


    this.maskScene.add(tileMesh);
  }

  _createClass(VectorTileMesh, [{
    key: "_init",
    value: function _init(data) {
      this._createMesh(data);
    }
  }, {
    key: "_createMesh",
    value: function _createMesh(data) {
      var _this = this;

      this.mesh = (0, _index.getRender)(this.layer.get('type'), data.shape)(null, this.layer, data.buffer);

      if (this.mesh.type !== 'composer') {
        // 热力图的情况
        this.mesh.onBeforeRender = function (renderer) {
          _this._renderMask(renderer);

          var zoom = _this.layer.scene.getZoom();

          (0, _object3dUtil.updateObjecteUniform)(_this._object3D, {
            u_time: _this.layer.scene._engine.clock.getElapsedTime(),
            u_zoom: zoom
          });
        };

        this.mesh.onAfterRender = function (renderer) {
          var context = renderer.context;
          context.clear(context.STENCIL_BUFFER_BIT);
          context.disable(context.STENCIL_TEST);
        };

        this._object3D.add(this.mesh);
      } else {
        // 如果是热力图
        this._object3D = this.mesh;
      }

      return this._object3D;
    }
  }, {
    key: "getMesh",
    value: function getMesh() {
      return this._object3D;
    }
  }, {
    key: "_renderMask",
    value: function _renderMask(renderer) {
      if (this.layer.get('layerType') === 'point') {
        // 点图层目前不需要mask
        return;
      }

      var context = renderer.context;
      renderer.autoClear = false;
      renderer.clearDepth();
      context.enable(context.STENCIL_TEST);
      context.stencilOp(context.REPLACE, context.REPLACE, context.REPLACE);
      context.stencilFunc(context.ALWAYS, 1, 0xffffffff);
      context.clearStencil(0);
      context.clear(context.STENCIL_BUFFER_BIT);
      context.colorMask(false, false, false, false); // config the stencil buffer to collect data for testing

      this.layer.scene._engine.renderScene(this.maskScene);

      context.colorMask(true, true, true, true);
      context.depthMask(false);
      renderer.clearDepth(); // only render where stencil is set to 1

      context.stencilFunc(context.EQUAL, 1, 0xffffffff); // draw if == 1

      context.stencilOp(context.KEEP, context.KEEP, context.KEEP);
    }
  }, {
    key: "_tileMaskMesh",
    value: function _tileMaskMesh() {
      var tilebound = this._tileBounds;
      var bl = [tilebound.getBottomLeft().x, tilebound.getBottomLeft().y, 0];
      var br = [tilebound.getBottomRight().x, tilebound.getBottomRight().y, 0];
      var tl = [tilebound.getTopLeft().x, tilebound.getTopLeft().y, 0];
      var tr = [tilebound.getTopRight().x, tilebound.getTopRight().y, 0];
      var positions = new Float32Array([].concat(bl, tr, br, bl, tl, tr));
      var geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      var maskMaterial = new _maskMaterial["default"]();
      var maskMesh = new THREE.Mesh(geometry, maskMaterial);
      return maskMesh;
    }
  }, {
    key: "getSelectFeature",
    value: function getSelectFeature(id) {
      var featurekey = this.layerSource.originData.featureKeys[id];

      if (featurekey && featurekey.index !== undefined) {
        var featureIndex = featurekey.index;
        return this.layerSource.originData.dataArray[featureIndex];
      }

      return null;
    }
  }, {
    key: "_tileBounds",
    value: function _tileBounds(lnglatBound) {
      var ne = this.layer.scene.project([lnglatBound.getNorthEast().lng, lnglatBound.getNorthEast().lat]);
      var sw = this.layer.scene.project([lnglatBound.getSouthWest().lng, lnglatBound.getSouthWest().lat]);
      return (0, _geoCoord.toBounds)(sw, ne);
    } // Get tile bounds in WGS84 coordinates

  }, {
    key: "_tileLnglatBounds",
    value: function _tileLnglatBounds(tile) {
      var e = this._tile2lng(tile[0] + 1, tile[2]);

      var w = this._tile2lng(tile[0], tile[2]);

      var s = this._tile2lat(tile[1] + 1, tile[2]);

      var n = this._tile2lat(tile[1], tile[2]);

      return (0, _geoCoord.toLngLatBounds)([w, n], [e, s]);
    }
  }, {
    key: "_tile2lng",
    value: function _tile2lng(x, z) {
      return x / Math.pow(2, z) * 360 - 180;
    }
  }, {
    key: "_tile2lat",
    value: function _tile2lat(y, z) {
      var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
      return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _object3dUtil.destoryObject)(this._object3D);
      (0, _object3dUtil.destoryObject)(this.maskScene);
      this._object3D = null;
      this.maskScene = null;
      this.layerData = null;
    }
  }]);

  return VectorTileMesh;
}();

exports["default"] = VectorTileMesh;