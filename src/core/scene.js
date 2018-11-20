import Engine from './engine';
import * as THREE from './three';
import * as layers from '../layer';
import Base from './base';
import LoadImage from './image';
import { MapProvider } from '../map/provider';
import GaodeMap from '../map/gaodeMap';
import Global from '../global';
export default class Scene extends Base {
  getDefaultCfg() {
    return Global.scene;
  }
  constructor(cfg) {
    super(cfg);
    this._initMap();
    this._initAttribution();
    this.addImage();
    this._layers = [];
  }

  _initEngine(mapContainer) {
    this._engine = new Engine(mapContainer, this);
    this._engine.run();
  }
    // 为pickup场景添加 object 对象
  addPickMesh(object) {
    this._engine._picking.add(object);
  }
  _initMap() {
    this.mapContainer = this.get('id');
    this._container = document.getElementById(this.mapContainer);
    const Map = new MapProvider(this.mapContainer, this._attrs);
    Map.on('mapLoad', () => {
      this._initEngine(Map.renderDom);
      const sceneMap = new GaodeMap(Map.map);
      Object.getOwnPropertyNames(sceneMap.prototype).forEach(key => {
        if (key !== 'constructor') {
          this.prototype[key] = sceneMap.prototype[key];
        }
      });
      this.map = Map.map;
      Map.asyncCamera(this._engine);
      this.initLayer();
      this.emit('loaded');
    });

  }
  initLayer() {
    for (const methodName in layers) {
      this[methodName] = cfg => {
        cfg ? cfg.mapType = this.mapType : cfg = { mapType: this.mapType };
        const layer = new layers[methodName](this, cfg);
        this._layers.push(layer);
        return layer;
      };
    }
  }
  on(type, hander) {
    if (this.map) { this.map.on(type, hander); }
    super.on(type, hander);
  }
  _initAttribution() {
    const message = '<a href="http://antv.alipay.com/zh-cn/index.html title="Large-scale WebGL-powered Geospatial Data Visualization">AntV | L7  </a>';
    const element = document.createElement('div');

    element.innerHTML = message;
    element.style.cssText += 'position: absolute; pointer-events:none;background: rgba(255, 255, 255, 0.7);font-size: 11px;z-index:100; padding:4px;bottom: 0;right:0px;';
    this._container.appendChild(element);
  }
  addImage() {
    this.image = new LoadImage();
  }
  _initEvent() {

  }
  getLayers() {
    return this._layers;
  }
  _addLight() {
    const scene = this._engine._scene;
    const ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);
  }
  _addLayer() {

  }
  removeLayer(layer) {
    const layerIndex = this._layers.indexOf(layer);
    if (layerIndex > -1) {
      this._layers.splice(layerIndex, 1);
    }
    layer.destroy();
  }

}
