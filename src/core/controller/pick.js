import Util from '../../util';
import * as THREE from '../three';
import pickingFragmentShader from '../engine/picking/picking_frag.glsl';
import { updateObjecteUniform } from '../../util/object3d-util';
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
    this.Object3D.remove(mesh);
  }
  addPickMesh(mesh) {
    const pickmaterial = mesh.material.clone();
    pickmaterial.fragmentShader = pickingFragmentShader;
    const pickingMesh = new THREE[mesh.type](mesh.geometry, pickmaterial);
    pickingMesh.name = this.layerId;
    pickingMesh.onBeforeRender = () => {
      const zoom = this.layer.scene.getZoom();
      updateObjecteUniform(pickingMesh, { u_zoom: zoom });
    };
    this.pickObject3D.add(pickingMesh);

  }
}
