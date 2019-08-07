import Util from '../../util';
import * as THREE from '../three';
import { updateObjecteUniform, destoryObject } from '../../util/object3d-util';
export default class PickContoller {
  constructor(cfg) {
    Util.assign(this, cfg);
    this.pickObject3D = new THREE.Object3D();
    this.addToPicking(this.pickObject3D);
  }
  getPickingId() {
    return this.layer.scene._engine._picking.getNextId();
  }
  addToPicking(object) {
    object.name = this.layer.layerId;
    this.layer.scene._engine._picking.add(object);
  }
  removePickingObject(object) {
    this.layer.scene._engine._picking.remove(object);
  }
  removePickingMesh(mesh) {
    this.pickObject3D.remove(mesh);
    destoryObject(mesh);
  }
  removePickMeshByName(name) {
    for (let i = 0; i < this.pickObject3D.children.length; i++) {
      if (this.pickObject3D.children[i].name === name) {
        this.removePickingMesh(this.pickObject3D.children[i]);
      }
    }
  }
  removeAllMesh() {
    this.pickObject3D.children.forEach(element => {

      this.pickObject3D.remove(element);
      destoryObject(element);
    });
  }
  addPickMesh(mesh) {
    const pickmaterial = mesh.material.clone();
    pickmaterial.defines.PICK = true;
    // pickmaterial.fragmentShader = pickingFragmentShader;
    const pickingMesh = new THREE[mesh.type](mesh.geometry, pickmaterial);
    pickingMesh.name = mesh.name;
    pickingMesh.onBeforeRender = () => {
      const zoom = this.layer.scene.getZoom();
      updateObjecteUniform(pickingMesh, { u_zoom: zoom });
    };
    this.pickObject3D.add(pickingMesh);
  }
}
