import PickingScene from './pickingScene';
import * as THREE from '../../three';
let nextId = 1;

class Picking {
  constructor(world, renderer, camera, scene) {
    this._world = world;
    this._renderer = renderer;
    this._camera = camera;
    this._raycaster = new THREE.Raycaster();
    this.scene = scene;
    this._envents = [];

    // TODO: Match this with the line width used in the picking layers
    this._raycaster.linePrecision = 3;
    this._pickingScene = PickingScene;
    const size = this._renderer.getSize();
    this._width = size.width;
    this._height = size.height;
    const parameters = { minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false
    };

    this._pickingTexture = new THREE.WebGLRenderTarget(this._width, this._height, parameters);

    this._nextId = 1;

    this._resizeTexture();
    this._initEvents();
  }

  _initEvents() {
    this._resizeHandler = this._resizeTexture.bind(this);
    window.addEventListener('resize', this._resizeHandler, false);

    // this._mouseUpHandler = this._onMouseUp.bind(this);
    // this._world._container.addEventListener('mouseup', this._mouseUpHandler, false);
    // this._world._container.addEventListener('mousemove', this._mouseUpHandler, false);
    // this._world._container.addEventListener('mousemove', this._onWorldMove.bind(this), false);
  }
  pickdata(event) {
    const point = { x: event.clientX, y: event.clientY, type: event.type };
    const normalisedPoint = { x: 0, y: 0 };
    normalisedPoint.x = (point.x / this._width) * 2 - 1;
    normalisedPoint.y = -(point.y / this._height) * 2 + 1;
    this._pickAllObject(point, normalisedPoint);
  }
  _onMouseUp(event) {
    // Only react to main button click
    // if (event.button !== 0) {
    //   return;
    // }

    const point = { x: event.clientX, y: event.clientY, type: event.type };
    const normalisedPoint = { x: 0, y: 0 };
    normalisedPoint.x = (point.x / this._width) * 2 - 1;
    normalisedPoint.y = -(point.y / this._height) * 2 + 1;
    this._pickAllObject(point, normalisedPoint);
    // this._pick(point, normalisedPoint);
  }
  

  _onWorldMove() {

    this._needUpdate = true;
  }

  // TODO: Ensure this doesn't get out of sync issue with the renderer resize
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
   // if (this._needUpdate) {
    this._renderer.render(this._pickingScene, this._camera, this._pickingTexture);
      // this._needUpdate = false;
    // }
    this.pixelBuffer = new Uint8Array(4);
    this._renderer.readRenderTargetPixels(texture, point.x, this._height - point.y, 1, 1, this.pixelBuffer);


  }
  // 添加dom事件 支持 mousedown ,mouseenter mouseleave mousemove mouseover mouseout mouse up
  on(type) {

    this._mouseUpHandler = this._onMouseUp.bind(this);
    this._world._container.addEventListener(type, this._mouseUpHandler, false);
    this._envents.push([ type, this._mouseUpHandler ]);
  }
  off(type, hander) {
    this._world._container.removeEventListener(type, this._mouseUpHandler, false);
    this._envents = this._envents.filter(item => {
      return item[0] === 'type' && hander === item[1];
    });

  }
  _filterObject(id) {
    this._pickingScene.children.forEach((object, index) => {
      index === id ? object.visible = true : object.visible = false;
    });
  }
  _pickAllObject(point, normalisedPoint) {
    this._pickingScene.children.forEach((object, index) => {
      this._filterObject(index);
      const item = this._pick(point, normalisedPoint, object.name);
      item.type = point.type;
      this._world.emit('pick', item);
      this._world.emit('pick-' + object.name, item);

    });
  }
  _updateRender() {
    this._renderer.render(this._pickingScene, this._camera, this._pickingTexture);
  }

  _pick(point, normalisedPoint, layerId) {
    this._update(point);
    // Interpret the pixel as an ID
    let id = (this.pixelBuffer[2] * 255 * 255) + (this.pixelBuffer[1] * 255) + (this.pixelBuffer[0]);
    // Skip if ID is 16646655 (white) as the background returns this
    if (id === 16646655 || this.pixelBuffer[3] === 0) {
      id = -999;
      // return;
    }

    this._raycaster.setFromCamera(normalisedPoint, this._camera);

    // Perform ray intersection on picking scene
    //
    // TODO: Only perform intersection test on the relevant picking mesh
    const intersects = this._raycaster.intersectObjects(this._pickingScene.children, true);
    const _point2d = { x: point.x, y: point.y };

    let _point3d;
    if (intersects.length > 0) {
      _point3d = intersects[0].point;
    }

    // Pass along as much data as possible for now until we know more about how
    // people use the picking API and what the returned data should be
    //
    // TODO: Look into the leak potential for passing so much by reference here
    const item = {
      layerId,
      featureId: id - 1,
      point2d: _point2d,
      point3d: _point3d,
      intersects
    };
    return item;

  }

  // Add mesh to picking scene
  //
  // Picking ID should already be added as an attribute
  add(mesh) {
    this._pickingScene.add(mesh);
    this._needUpdate = true;
  }

  // Remove mesh from picking scene
  remove(mesh) {
    this._pickingScene.remove(mesh);
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
    this._envents.forEach(event => {
      this._world._container.removeEventListener(event[0], event[1], false);
    });

    this._world.off('move', this._onWorldMove);

    if (this._pickingScene.children) {
      // Remove everything else in the layer
      let child;
      for (let i = this._pickingScene.children.length - 1; i >= 0; i--) {
        child = this._pickingScene.children[i];

        if (!child) {
          continue;
        }

        this._pickingScene.remove(child);

        // Probably not a good idea to dispose of geometry due to it being
        // shared with the non-picking scene
        // if (child.geometry) {
        //   // Dispose of mesh and materials
        //   child.geometry.dispose();
        //   child.geometry = null;
        // }

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
}

// Initialise without requiring new keyword
export default function(world, renderer, camera, scene) {
  return new Picking(world, renderer, camera, scene);
}
