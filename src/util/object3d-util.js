import pickingFragmentShader from '../core/engine/picking/picking_frag.glsl';
import * as THREE from '../core/three';
export function destoryObject(obj) {
  if (!obj) {
    return;
  }
  if (obj.children) {
    for (let i = 0; i < obj.children.length; i++) {
      const child = obj.children[i];
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
export function updateObjecteUniform(obj, newOption) {
  if (!obj) {
    return;
  }
  if (obj.children) {
    for (let i = 0; i < obj.children.length; i++) {
      const child = obj.children[i];
      updateObjecteUniform(child, newOption);
    }
  }
  if (obj.material) {
    obj.material.updateUninform(newOption);
  }
}
export function getPickObject(obj, newbj) {
  if (!obj) {
    return;
  }
  if (obj.isMesh) {
    const pickmaterial = obj.material.clone();
    pickmaterial.fragmentShader = pickingFragmentShader;
    const pickMesh = new THREE[obj.type](obj.geometry, pickmaterial);
    newbj.add(pickMesh);
  }
  if (obj.children) {
    const newObj = new THREE.Object3D();
    for (let i = 0; i < obj.children.length; i++) {
      const child = obj.children[i];
      newObj.add(getPickObject(child, newbj));
    }
  }
}
