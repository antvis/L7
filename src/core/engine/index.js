import EventEmitter from 'wolfy87-eventemitter';
import * as THREE from '../three';
import Scene from './scene';
import Camera from './camera';
import Renderer from './renderer';
import Picking from './picking/picking';
export default class Engine extends EventEmitter {
  constructor(container, world) {
    super();
    this._scene = Scene;
    this._camera = new Camera(container).camera;
    this._renderer = new Renderer(container).renderer;
    this._world = world;
    this._picking = Picking(this._world, this._renderer, this._camera, this._scene);
    // this._renderer.context.getExtension('OES_texture_float');
    // this._renderer.context.getExtension('OES_texture_float_linear');
    // this._renderer.context.getExtension('OES_texture_half_float');
    // this._renderer.context.getExtension('OES_texture_half_float_linear');
    this.clock = new THREE.Clock();
  }
  _initPostProcessing() {

  }
  update() {

    this._renderer.render(this._scene, this._camera);

  }
  destroy() {

  }
  run() {

    this.update();
    this.engineID = requestAnimationFrame(this.run.bind(this));
  }
  stop() {
    cancelAnimationFrame(this.engineID);
  }
}
