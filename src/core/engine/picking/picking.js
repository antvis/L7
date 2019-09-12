import PickingScene from './pickingScene';
import * as THREE from '../../three';
import { destoryObject } from '../../../util/object3d-util';
let nextId = 1;

class Picking {
  constructor(world, renderer, camera) {
    this._world = world;
    this._renderer = renderer;
    this._camera = camera;
    this._pickingScene = PickingScene;
    this.world = new THREE.Group();
    this._pickingScene.add(this.world);
    const size = this._renderer.getSize();
    this._width = size.width;
    this._height = size.height;
    const parameters = { minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: true
    };

    this._pickingTexture = new THREE.WebGLRenderTarget(this._width / 10, this._height / 10, parameters);

    this._nextId = 1;

    this._resizeTexture();
    this._initEvents();
  }

  _initEvents() {
    this._resizeHandler = this._resizeTexture.bind(this);
    window.addEventListener('resize', this._resizeHandler, false);
  }
  pickdata(event) {
    let point = { x: event.offsetX, y: event.offsetY, type: event.type, _parent: event };
    if (event.type.substr(0, 5) === 'touch') {
      if (event.touches.length === 0) {
        return;
      }
      const touch = event.touches[0];
      point = { x: touch.clientX, y: touch.clientY, type: event.type, _parent: touch };
    }
    const normalisedPoint = { x: 0, y: 0 };
    normalisedPoint.x = (point.x / this._width) * 2 - 1;
    normalisedPoint.y = -(point.y / this._height) * 2 + 1;
    this._pickAllObject(point, normalisedPoint);
  }
  _resizeTexture() {
    const size = this._renderer.getSize();

    this._width = size.width;
    this._height = size.height;
    this._pickingTexture.setSize(this._width, this._height);
    this._pixelBuffer = new Uint8Array(4 * this._width * this._height);
    this._needUpdate = true;
  }
  _update(point) {
    const texture = this._pickingTexture;
    this._renderer.render(this._pickingScene, this._camera, texture);
    this.pixelBuffer = new Uint8Array(4);
    this._renderer.readRenderTargetPixels(texture, point.x, this._height - point.y, 1, 1, this.pixelBuffer);


  }
  _filterObject(id) {
    this.world.children.forEach((object, index) => {
      index === id ? object.visible = true : object.visible = false;
    });
  }
  _layerIsVisable(object) {
    const layers = this._world.getLayers();
    let isVisable = false;
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (object.name === layer.layerId) {
        isVisable = layer.get('visible');
        break;
      }
    }
    return isVisable;
  }
  _pickAllObject(point, normalisedPoint) {

    this.world.children.forEach((object, index) => {
      if (!this._layerIsVisable(object)) {
        return;
      }
      this._filterObject(index);
      const item = this._pick(point, normalisedPoint, object.name);
      item.type = point.type;
      item._parent = point._parent;
      this._world.emit('pick', item);
      this._world.emit('pick-' + object.name, item);

    });
  }
  _pick(point, normalisedPoint, layerId) {
    this._update(point);
    let id = (this.pixelBuffer[2] * 255 * 255) + (this.pixelBuffer[1] * 255) + (this.pixelBuffer[0]);
    if (id === 16646655 || this.pixelBuffer[3] === 0) {
      id = -999;
      // return;
    }
    const _point2d = { x: point.x, y: point.y };
    const item = {
      layerId,
      featureId: id,
      point2d: _point2d
    };
    return item;

  }

  // Add mesh to picking scene
  //
  // Picking ID should already be added as an attribute
  add(mesh) {
    this.world.add(mesh);

    this._needUpdate = true;
  }

  // Remove mesh from picking scene
  remove(mesh) {
    this.world.remove(mesh);
    this._needUpdate = true;
  }

  // Returns next ID to use for picking
  getNextId() {
    return nextId++;
  }

  destroy() {
    // TODO: Find a way to properly remove these listeners as they stay
    // active at the moment
    window.removeEventListener('resize', this._resizeHandler, false);
    destoryObject(this._pickingScene);

    this._pickingScene = null;
    this._pickingTexture = null;
    this._pixelBuffer = null;

    this._world = null;
    this._renderer = null;
    this._camera = null;
  }
}

// Initialise without requiring new keyword
export default function(world, renderer, camera, scene) {
  return new Picking(world, renderer, camera, scene);
}
