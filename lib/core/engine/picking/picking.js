"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _pickingScene = _interopRequireDefault(require("./pickingScene"));

var THREE = _interopRequireWildcard(require("../../three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var nextId = 1;

var Picking =
/*#__PURE__*/
function () {
  function Picking(world, renderer, camera) {
    _classCallCheck(this, Picking);

    this._world = world;
    this._renderer = renderer;
    this._camera = camera;
    this._pickingScene = _pickingScene["default"];
    this.world = new THREE.Group();

    this._pickingScene.add(this.world);

    var size = this._renderer.getSize();

    this._width = size.width;
    this._height = size.height;
    var parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: true
    };
    this._pickingTexture = new THREE.WebGLRenderTarget(this._width, this._height, parameters);
    this._nextId = 1;

    this._resizeTexture();

    this._initEvents();
  }

  _createClass(Picking, [{
    key: "_initEvents",
    value: function _initEvents() {
      this._resizeHandler = this._resizeTexture.bind(this);
      window.addEventListener('resize', this._resizeHandler, false);
    }
  }, {
    key: "pickdata",
    value: function pickdata(event) {
      var point = {
        x: event.offsetX,
        y: event.offsetY,
        type: event.type
      };
      var normalisedPoint = {
        x: 0,
        y: 0
      };
      normalisedPoint.x = point.x / this._width * 2 - 1;
      normalisedPoint.y = -(point.y / this._height) * 2 + 1;

      this._pickAllObject(point, normalisedPoint);
    }
  }, {
    key: "_resizeTexture",
    value: function _resizeTexture() {
      var size = this._renderer.getSize();

      this._width = size.width;
      this._height = size.height;

      this._pickingTexture.setSize(this._width, this._height);

      this._pixelBuffer = new Uint8Array(4 * this._width * this._height);
      this._needUpdate = true;
    }
  }, {
    key: "_update",
    value: function _update(point) {
      var texture = this._pickingTexture;

      this._renderer.render(this._pickingScene, this._camera, texture);

      this.pixelBuffer = new Uint8Array(4);

      this._renderer.readRenderTargetPixels(texture, point.x, this._height - point.y, 1, 1, this.pixelBuffer);
    }
  }, {
    key: "_filterObject",
    value: function _filterObject(id) {
      this.world.children.forEach(function (object, index) {
        index === id ? object.visible = true : object.visible = false;
      });
    }
  }, {
    key: "_layerIsVisable",
    value: function _layerIsVisable(object) {
      var layers = this._world.getLayers();

      var isVisable = false;

      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        if (object.name === layer.layerId) {
          isVisable = layer.get('visible');
          break;
        }
      }

      return isVisable;
    }
  }, {
    key: "_pickAllObject",
    value: function _pickAllObject(point, normalisedPoint) {
      var _this = this;

      this.world.children.forEach(function (object, index) {
        if (!_this._layerIsVisable(object)) {
          return;
        }

        _this._filterObject(index);

        var item = _this._pick(point, normalisedPoint, object.name);

        item.type = point.type;

        _this._world.emit('pick', item);

        _this._world.emit('pick-' + object.name, item);
      });
    } // _updateRender() {
    //   this._renderer.render(this._pickingScene, this._camera, this._pickingTexture);
    // }

  }, {
    key: "_pick",
    value: function _pick(point, normalisedPoint, layerId) {
      this._update(point);

      var id = this.pixelBuffer[2] * 255 * 255 + this.pixelBuffer[1] * 255 + this.pixelBuffer[0];

      if (id === 16646655 || this.pixelBuffer[3] === 0) {
        id = -999; // return;
      }

      var _point2d = {
        x: point.x,
        y: point.y
      };
      var item = {
        layerId: layerId,
        featureId: id,
        point2d: _point2d
      };
      return item;
    } // Add mesh to picking scene
    //
    // Picking ID should already be added as an attribute

  }, {
    key: "add",
    value: function add(mesh) {
      this.world.add(mesh);
      this._needUpdate = true;
    } // Remove mesh from picking scene

  }, {
    key: "remove",
    value: function remove(mesh) {
      this.world.remove(mesh);
      this._needUpdate = true;
    } // Returns next ID to use for picking

  }, {
    key: "getNextId",
    value: function getNextId() {
      return nextId++;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this2 = this;

      // TODO: Find a way to properly remove these listeners as they stay
      // active at the moment
      window.removeEventListener('resize', this._resizeHandler, false);

      this._envents.forEach(function (event) {
        _this2._world._container.removeEventListener(event[0], event[1], false);
      });

      if (this._pickingScene.children) {
        // Remove everything else in the layer
        var child;

        for (var i = this._pickingScene.children.length - 1; i >= 0; i--) {
          child = this._pickingScene.children[i];

          if (!child) {
            continue;
          }

          this._pickingScene.remove(child);

          if (child.material) {
            if (child.material.map) {
              child.material.map.dispose();
              child.material.map = null;
            }

            child.material.dispose();
            child.material = null;
          }
        }
      }

      this._pickingScene = null;
      this._pickingTexture = null;
      this._pixelBuffer = null;
      this._world = null;
      this._renderer = null;
      this._camera = null;
    }
  }]);

  return Picking;
}(); // Initialise without requiring new keyword


function _default(world, renderer, camera, scene) {
  return new Picking(world, renderer, camera, scene);
}