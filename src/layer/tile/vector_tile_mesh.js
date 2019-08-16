import { destoryObject, updateObjecteUniform } from '../../util/object3d-util';
import * as THREE from '../../core/three';
import MaskMaterial from '../../geom/material/tile/maskMaterial';
import { toLngLatBounds, toBounds } from '@antv/geo-coord';
import { getRender } from '../render/index';
const r2d = 180 / Math.PI;
export default class VectorTileMesh {
  constructor(layer, data) {
    this.layer = layer;
    this._object3D = new THREE.Object3D();
    this._object3D.name = data.tileId;
    this._tile = data.tileId.split('_').map(v => v * 1);
    this._tileLnglatBounds = this._tileLnglatBounds(this._tile);

    this._tileBounds = this._tileBounds(this._tileLnglatBounds);

    this._center = this._tileBounds.getCenter();

    this._centerLnglat = this._tileLnglatBounds.getCenter();
    this._init(data);

    this.maskScene = new THREE.Scene();
    const tileMesh = this._tileMaskMesh();
    // this._object3D.add(tileMesh);
    this.maskScene.add(tileMesh);
    this._bufferData = data;
  }
  _init(data) {
    this._createMesh(data);

  }
  getFeatureIndex(id) {
    return this._bufferData.featureKey.indexOf(id);
  }

  _createMesh(data) {
    this.mesh = getRender(this.layer.get('type'), data.shape)(null, this.layer, data.buffer);
    if (this.mesh.type !== 'composer') { // 热力图的情况
      this.mesh.onBeforeRender = renderer => {
        this._renderMask(renderer);
        const zoom = this.layer.scene.getZoom();
        updateObjecteUniform(this._object3D, {
          u_time: this.layer.scene._engine.clock.getElapsedTime(),
          u_zoom: zoom
        });
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
    return this._object3D;
  }
  getMesh() {
    return this._object3D;
  }

  _renderMask(renderer) {
    if (this.layer.get('layerType') === 'point') { // 点图层目前不需要mask
      return;
    }
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
    this.layer.scene._engine.renderScene(this.maskScene);
    context.colorMask(true, true, true, true);
    context.depthMask(false);
    renderer.clearDepth();

    // only render where stencil is set to 1

    context.stencilFunc(context.EQUAL, 1, 0xffffffff); // draw if == 1
    context.stencilOp(context.KEEP, context.KEEP, context.KEEP);
  }
  _tileMaskMesh() {
    const tilebound = this._tileBounds;
    const bl = [ tilebound.getBottomLeft().x, tilebound.getBottomLeft().y, 0 ];
    const br = [ tilebound.getBottomRight().x, tilebound.getBottomRight().y, 0 ];
    const tl = [ tilebound.getTopLeft().x, tilebound.getTopLeft().y, 0 ];
    const tr = [ tilebound.getTopRight().x, tilebound.getTopRight().y, 0 ];
    const positions = new Float32Array([ ...bl, ...tr, ...br, ...bl, ...tl, ...tr ]);
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const maskMaterial = new MaskMaterial();
    const maskMesh = new THREE.Mesh(geometry, maskMaterial);
    return maskMesh;
  }
  getSelectFeature(id) {
    const featurekey = this.layerSource.originData.featureKeys[id];
    if (featurekey && featurekey.index !== undefined) {
      const featureIndex = featurekey.index;
      return this.layerSource.originData.dataArray[featureIndex];
    }
    return null;
  }
  _tileBounds(lnglatBound) {
    const ne = this.layer.scene.project([ lnglatBound.getNorthEast().lng, lnglatBound.getNorthEast().lat ]);
    const sw = this.layer.scene.project([ lnglatBound.getSouthWest().lng, lnglatBound.getSouthWest().lat ]);
    return toBounds(sw, ne);
  }
  // Get tile bounds in WGS84 coordinates
  _tileLnglatBounds(tile) {
    const e = this._tile2lng(tile[0] + 1, tile[2]);
    const w = this._tile2lng(tile[0], tile[2]);
    const s = this._tile2lat(tile[1] + 1, tile[2]);
    const n = this._tile2lat(tile[1], tile[2]);
    return toLngLatBounds([ w, n ], [ e, s ]);
  }

  _tile2lng(x, z) {
    return x / Math.pow(2, z) * 360 - 180;
  }

  _tile2lat(y, z) {
    const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  }

  destroy() {
    destoryObject(this._object3D);
    destoryObject(this.maskScene);
    this._object3D = null;
    this.maskScene = null;
    this.layerData = null;
  }
}
