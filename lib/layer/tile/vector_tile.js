"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tile = _interopRequireDefault(require("./tile"));

var _object3dUtil = require("../../util/object3d-util");

var THREE = _interopRequireWildcard(require("../../core/three"));

var _maskMaterial = _interopRequireDefault(require("../../geom/material/tile/maskMaterial"));

var _index = require("../render/index");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var VectorTile =
/*#__PURE__*/
function (_Tile) {
  _inherits(VectorTile, _Tile);

  function VectorTile() {
    _classCallCheck(this, VectorTile);

    return _possibleConstructorReturn(this, _getPrototypeOf(VectorTile).apply(this, arguments));
  }

  _createClass(VectorTile, [{
    key: "_createMesh",
    value: function _createMesh() {
      var _this = this;

      var layerData = this.layerData;

      if (this.layer.get('layerType') === 'point') {
        this.layer.shape = this.layer._getShape(layerData);
      }

      this.mesh = (0, _index.getRender)(this.layer.get('layerType'), this.layer.shape)(layerData, this.layer);

      if (this.mesh.type !== 'composer') {
        // 热力图的情况
        this.mesh.onBeforeRender = function (renderer) {
          _this._renderMask(renderer);
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

      setTimeout(function () {
        _this.emit('tileLoaded');
      }, 0);
      return this._object3D;
    }
  }, {
    key: "_renderMask",
    value: function _renderMask(renderer) {
      var zoom = this.layer.scene.getZoom();
      (0, _object3dUtil.updateObjecteUniform)(this.mesh, {
        u_time: this.layer.scene._engine.clock.getElapsedTime(),
        u_zoom: zoom
      });

      if (this.layer.get('layerType') === 'point') {
        // 点图层目前不需要mask
        return;
      }

      var maskScene = new THREE.Scene();
      this.maskScene = maskScene;

      var tileMesh = this._tileMaskMesh();

      maskScene.add(tileMesh);
      var context = renderer.context;
      renderer.autoClear = false;
      renderer.clearDepth();
      context.enable(context.STENCIL_TEST);
      context.stencilOp(context.REPLACE, context.REPLACE, context.REPLACE);
      context.stencilFunc(context.ALWAYS, 1, 0xffffffff);
      context.clearStencil(0);
      context.clear(context.STENCIL_BUFFER_BIT);
      context.colorMask(false, false, false, false); // config the stencil buffer to collect data for testing

      this.layer.scene._engine.renderScene(maskScene);

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
      var positions = [].concat(bl, tr, br, bl, tl, tr);
      var geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      var maskMaterial = new _maskMaterial["default"]();
      var maskMesh = new THREE.Mesh(geometry, maskMaterial);
      return maskMesh;
    }
  }, {
    key: "_abortRequest",
    value: function _abortRequest() {
      if (!this.xhrRequest) {
        return;
      }

      this.xhrRequest.abort();
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
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(VectorTile.prototype), "destroy", this).call(this);

      (0, _object3dUtil.destoryObject)(this.maskScene);
      this._object3D = null;
      this.maskScene = null;
      this.layerData = null;
    }
  }]);

  return VectorTile;
}(_tile["default"]);

exports["default"] = VectorTile;