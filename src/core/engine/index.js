import EventEmitter from 'wolfy87-eventemitter';
import * as THREE from '../three';
import Scene from './scene';
import Camera from './camera';
import Renderer from './renderer';
import Picking from './picking/picking';
import { destoryObject } from '../../util/object3d-util';
export default class Engine extends EventEmitter {
  constructor(container, world) {
    super();
    this._scene = Scene;
    this._camera = new Camera(container).camera;
    this._renderer = new Renderer(container).renderer;
    this._world = world;// 地图场景实例
    // for MapBox
    this.world = new THREE.Group();
    this._scene.add(this.world);
    this._picking = Picking(this._world, this._renderer, this._camera);
    this.clock = new THREE.Clock();
    this.composerLayers = [];
  }
  _initPostProcessing() {
    this.composerLayers.forEach(layer => {
      layer.visible && layer.render();
    });
  }
  update() {
    this._renderer.clear();
    this._renderer.render(this._scene, this._camera);
    this._initPostProcessing();
  }
  destroy() {
    destoryObject(this._scene);
    this.composerLayers.forEach(layer => {
      layer.distory();
    });
    destoryObject(this.composerLayers);

    this._picking.destroy();
    this._picking = null;
    this._world = null;
    this.clock = null;
    this._camera = null;
    this._renderer = null;
  }
  // 渲染第三方Scene对象
  renderScene(scene) {
    this._renderer.render(scene, this._camera);
  }
  run() {
    this.update();
    this.engineID = requestAnimationFrame(this.run.bind(this));
  }
  stop() {
    cancelAnimationFrame(this.engineID);
  }
}
