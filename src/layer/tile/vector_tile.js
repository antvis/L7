import Tile from './tile';

import { destoryObject, updateObjecteUniform } from '../../util/object3d-util';
import * as THREE from '../../core/three';
import MaskMaterial from '../../geom/material/tile/maskMaterial';
import { getRender } from '../render/index';
export default class VectorTile extends Tile {
  _createMesh() {
    const layerData = this.layerData;
    if (this.layer.get('layerType') === 'point') {
      this.layer.shape = this.layer._getShape(layerData);
    }
    this.mesh = getRender(this.layer.get('layerType'), this.layer.shape)(layerData, this.layer);
    if (this.mesh.type !== 'composer') { // 热力图的情况
      this.mesh.onBeforeRender = renderer => {
        this._renderMask(renderer);
      };
      this.mesh.onAfterRender = renderer => {
        const context = renderer.context;
        context.clear(context.STENCIL_BUFFER_BIT);
        context.disable(context.STENCIL_TEST);
      };
      this._object3D.add(this.mesh);
    } else { // 如果是热力图
      this._object3D = this.mesh;
    }
    setTimeout(() => {
      this.emit('tileLoaded');
    }, 0);
    return this._object3D;
  }
  _renderMask(renderer) {
    const zoom = this.layer.scene.getZoom();
    updateObjecteUniform(this.mesh, {
      u_time: this.layer.scene._engine.clock.getElapsedTime(),
      u_zoom: zoom
    });
    if (this.layer.get('layerType') === 'point') { // 点图层目前不需要mask
      return;
    }
    const maskScene = new THREE.Scene();
    this.maskScene = maskScene;
    const tileMesh = this._tileMaskMesh();
    maskScene.add(tileMesh);
    const context = renderer.context;
    renderer.autoClear = false;
    renderer.clearDepth();
    context.enable(context.STENCIL_TEST);
    context.stencilOp(context.REPLACE, context.REPLACE, context.REPLACE);
    context.stencilFunc(context.ALWAYS, 1, 0xffffffff);
    context.clearStencil(0);
    context.clear(context.STENCIL_BUFFER_BIT);
    context.colorMask(false, false, false, false);

    // config the stencil buffer to collect data for testing
    this.layer.scene._engine.renderScene(maskScene);
    context.colorMask(true, true, true, true);
    context.depthMask(false);
    renderer.clearDepth();

		// only render where stencil is set to 1

    context.stencilFunc(context.EQUAL, 1, 0xffffffff);  // draw if == 1
    context.stencilOp(context.KEEP, context.KEEP, context.KEEP);
  }
  _tileMaskMesh() {
    const tilebound = this._tileBounds;
    const bl = [ tilebound.getBottomLeft().x, tilebound.getBottomLeft().y, 0 ];
    const br = [ tilebound.getBottomRight().x, tilebound.getBottomRight().y, 0 ];
    const tl = [ tilebound.getTopLeft().x, tilebound.getTopLeft().y, 0 ];
    const tr = [ tilebound.getTopRight().x, tilebound.getTopRight().y, 0 ];
    const positions = [ ...bl, ...tr, ...br, ...bl, ...tl, ...tr ];
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const maskMaterial = new MaskMaterial();
    const maskMesh = new THREE.Mesh(geometry, maskMaterial);
    return maskMesh;
  }
  _abortRequest() {
    if (!this.xhrRequest) {
      return;
    }

    this.xhrRequest.abort();
  }
  getSelectFeature(id) {
    const featurekey = this.layerSource.originData.featureKeys[id];
    if (featurekey && featurekey.index !== undefined) {
      const featureIndex = featurekey.index;
      return this.layerSource.originData.dataArray[featureIndex];
    }
    return null;
  }
  destroy() {
    super.destroy();
    destoryObject(this.maskScene);
    this._object3D = null;
    this.maskScene = null;
    this.layerData = null;
  }
}
