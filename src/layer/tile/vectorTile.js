import Tile from './tile';
import { getArrayBuffer } from '../../util/ajax';
import PBF from 'pbf';
import * as VectorParser from '@mapbox/vector-tile';
import * as THREE from '../../core/three';
import MaskMaterial from '../../geom/material/tile/maskMaterial';
import { LineBuffer } from '../../geom/buffer/index';
import DrawLine from '../../layer/render/line/drawMeshLine';

export default class VectorTile extends Tile {
  requestTileAsync() {
    // Making this asynchronous really speeds up the LOD framerate
    setTimeout(() => {
      if (!this._mesh) {
       // this._mesh = this._createMesh();
        this._requestTile();
      }
    }, 0);
  }
  _requestTile() {
    const urlParams = {
      x: this._tile[0],
      y: this._tile[1],
      z: this._tile[2]
    };

    const url = this._getTileURL(urlParams);
    this.xhrRequest = getArrayBuffer({ url }, (err, data) => {
      if (err) {
        this._noData = true;
        return;
      }
      this._isLoaded = true;
      this._parserData(data.data);
    });
  }
  _creatSource(data) {
    this.source = this.layer.tileSource(data);
  }
  _parserData(data) {
    const tile = new VectorParser.VectorTile(new PBF(data));
    // CHN_Cities_L   CHN_Cities   CHN_L
    const layerName = 'county4326';
    const features = [];
    const vectorLayer = tile.layers[layerName];
    for (let i = 0; i < vectorLayer.length; i++) {
      const feature = vectorLayer.feature(i);
      features.push(feature.toGeoJSON(this._tile[0], this._tile[1], this._tile[2]));
    }
    const geodata = {
      type: 'FeatureCollection',
      features
    };
    this._creatSource(geodata);
    this._createMesh();
  }
  _createMesh() {
    this.layerData = this.layer._mapping(this.source);
    const style = this.layer.get('styleOptions');
    const buffer = new LineBuffer({
      layerData: this.layerData,
      style,
      shapeType: 'line'

    });
    const animateOptions = this.layer.get('animateOptions');
    const activeOption = this.layer.get('activedOptions');
    const layerCfg = {
      zoom: this.layer.scene.getZoom(),
      style,
      animateOptions,
      activeOption
    };
    this.mesh = new DrawLine(buffer.attributes, layerCfg, this.layer);
    this.mesh.onBeforeRender = renderer => {
      this._renderMask(renderer);
    };
    this.mesh.onAfterRender = renderer => {
      const context = renderer.context;
      context.disable(context.STENCIL_TEST);
    };
    this._object3D.add(this.mesh);
    this.emit('tileLoaded');
    return this._object3D;
  }
  _renderMask(renderer) {
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
    context.depthMask(true);
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
  destroy() {

    this.mesh.destroy();
    // if (this.maskScene) {
    //   this.maskScene.children[0].geometry = null;
    //   this.maskScene.children[0].material.dispose();
    //   this.maskScene.children[0].material = null;
    // }
  }
}
