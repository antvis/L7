"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("../../util"));

var THREE = _interopRequireWildcard(require("../three"));

var _object3dUtil = require("../../util/object3d-util");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PickContoller =
/*#__PURE__*/
function () {
  function PickContoller(cfg) {
    _classCallCheck(this, PickContoller);

    _util["default"].assign(this, cfg);

    this.pickObject3D = new THREE.Object3D();
    this.addToPicking(this.pickObject3D);
  }

  _createClass(PickContoller, [{
    key: "getPickingId",
    value: function getPickingId() {
      return this.layer.scene._engine._picking.getNextId();
    }
  }, {
    key: "addToPicking",
    value: function addToPicking(object) {
      object.name = this.layer.layerId;

      this.layer.scene._engine._picking.add(object);
    }
  }, {
    key: "removePickingObject",
    value: function removePickingObject(object) {
      this.layer.scene._engine._picking.remove(object);
    }
  }, {
    key: "removePickingMesh",
    value: function removePickingMesh(mesh) {
      this.pickObject3D.remove(mesh);
      (0, _object3dUtil.destoryObject)(mesh);
    }
  }, {
    key: "removePickMeshByName",
    value: function removePickMeshByName(name) {
      for (var i = 0; i < this.pickObject3D.children.length; i++) {
        if (this.pickObject3D.children[i].name === name) {
          this.removePickingMesh(this.pickObject3D.children[i]);
        }
      }
    }
  }, {
    key: "removeAllMesh",
    value: function removeAllMesh() {
      var _this = this;

      this.pickObject3D.children.forEach(function (element) {
        _this.pickObject3D.remove(element);

        (0, _object3dUtil.destoryObject)(element);
      });
    }
  }, {
    key: "addPickMesh",
    value: function addPickMesh(mesh) {
      var _this2 = this;

      var pickmaterial = mesh.material.clone();
      pickmaterial.defines.PICK = true; // pickmaterial.fragmentShader = pickingFragmentShader;

      var pickingMesh = new THREE[mesh.type](mesh.geometry, pickmaterial);
      pickingMesh.name = mesh.name;

      pickingMesh.onBeforeRender = function () {
        var zoom = _this2.layer.scene.getZoom();

        (0, _object3dUtil.updateObjecteUniform)(pickingMesh, {
          u_zoom: zoom
        });
      };

      this.pickObject3D.add(pickingMesh);
    }
  }]);

  return PickContoller;
}();

exports["default"] = PickContoller;