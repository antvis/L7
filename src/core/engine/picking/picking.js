import PickingScene from './pickingScene';
import * as THREE from '../../three';
// TODO: Look into a way of setting this up without passing in a renderer and
// camera from the engine

// TODO: Add a basic indicator on or around the mouse pointer when it is over
// something pickable / clickable
//
// A simple transparent disc or ring at the mouse point should work to start, or
// even just changing the cursor to the CSS 'pointer' style
//
// Probably want this on mousemove with a throttled update as not to spam the
// picking method
//
// Relies upon the picking method not redrawing the scene every call due to
// the way TileLayer invalidates the picking scene

let nextId = 1;

class Picking {
  constructor(world, renderer, camera, scene) {
    this._world = world;
    this._renderer = renderer;
    this._camera = camera;
    this._raycaster = new THREE.Raycaster();
    this.scene = scene;

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

    this._mouseUpHandler = this._onMouseUp.bind(this);
    this._world._container.addEventListener('mouseup', this._mouseUpHandler, false);

    // this._world.on('move', this._onWorldMove, this);
  }

  _onMouseUp(event) {
    // Only react to main button click
    if (event.button !== 0) {
      return;
    }

    const point = { x: event.clientX, y: event.clientY };
    const normalisedPoint = { x: 0, y: 0 };
    normalisedPoint.x = (point.x / this._width) * 2 - 1;
    normalisedPoint.y = -(point.y / this._height) * 2 + 1;

    this._pick(point, normalisedPoint);
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

  // TODO: Make this only re-draw the scene if both an update is needed and the
  // camera has moved since the last update
  //
  // Otherwise it re-draws the scene on every click due to the way LOD updates
  // work in TileLayer – spamming this.add() and this.remove()
  //
  // TODO: Pause updates during map move / orbit / zoom as this is unlikely to
  // be a point in time where the user cares for picking functionality
  _update(point) {
    // if (this._needUpdate) {
    const texture = this._pickingTexture;
    this._renderer.render(this._pickingScene, this._camera, this._pickingTexture);//  this._pickingTexture this._pickingScene
      // Read the rendering texture

    this.pixelBuffer = new Uint8Array(4);
    this._renderer.readRenderTargetPixels(texture, point.x, this._height - point.y, 1, 1, this.pixelBuffer);

      // this._needUpdate = false;
    // }
  }
  _updateRender() {
    this._renderer.render(this._pickingScene, this._camera, this._pickingTexture);
  }

  _pick(point, normalisedPoint) {
    this._update(point);
    // Interpret the pixel as an ID
    const id = (this.pixelBuffer[2] * 255 * 255) + (this.pixelBuffer[1] * 255) + (this.pixelBuffer[0]);
    // Skip if ID is 16646655 (white) as the background returns this
    if (id === 16646655) {
      return;
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
      featureId: id,
      point2d: _point2d,
      point3d: _point3d,
      intersects
    };
    this._world.emit('pick', item);
    // this._world.emit('pick-' + id, _point2d, _point3d, intersects);
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
    this._world._container.removeEventListener('mouseup', this._mouseUpHandler, false);

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
