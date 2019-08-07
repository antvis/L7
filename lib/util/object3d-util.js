"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.destoryObject = destoryObject;
exports.updateObjecteUniform = updateObjecteUniform;
exports.getPickObject = getPickObject;

var _picking_frag = _interopRequireDefault(require("../core/engine/picking/picking_frag.glsl"));

var THREE = _interopRequireWildcard(require("../core/three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function destoryObject(obj) {
  if (!obj) {
    return;
  }

  if (obj.children) {
    for (var i = 0; i < obj.children.length; i++) {
      var child = obj.children[i];
      destoryObject(child);
    }
  }

  if (obj.geometry) {
    obj.geometry.dispose();
    obj.geometry = null;
  }

  if (obj.material) {
    if (obj.material.map) {
      obj.material.map.dispose();
      obj.material.map = null;
    }

    obj.material.dispose();
    obj.material = null;
  }
}

function updateObjecteUniform(obj, newOption) {
  if (!obj) {
    return;
  }

  if (obj.children) {
    for (var i = 0; i < obj.children.length; i++) {
      var child = obj.children[i];
      updateObjecteUniform(child, newOption);
    }
  }

  if (obj.material) {
    obj.material.updateUninform(newOption);
  }
}

function getPickObject(obj, newbj) {
  if (!obj) {
    return;
  }

  if (obj.isMesh) {
    var pickmaterial = obj.material.clone();
    pickmaterial.fragmentShader = _picking_frag["default"];
    var pickMesh = new THREE[obj.type](obj.geometry, pickmaterial);
    newbj.add(pickMesh);
  }

  if (obj.children) {
    var newObj = new THREE.Object3D();

    for (var i = 0; i < obj.children.length; i++) {
      var child = obj.children[i];
      newObj.add(getPickObject(child, newbj));
    }
  }
}