import Engine from './engine';
import * as THREE from './three';
import * as layers from '../layer';
import Base from './base';
import LoadImage from './image';
import Utils from '../util';
import { MapProvider } from '../map/provider';
import { MapBox } from '../map/mapbox';
import AMap from '../map/AMap';
import Global from '../global';
export default class Scene extends Base {
  getDefaultCfg() {
    return Global.scene;
  }
  constructor(cfg) {
    super(cfg);
    this._initMap();
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
    const mapType = this.mapType = this.get('mapType');
    this.mapContainer = this.get('id');
    this._container = document.getElementById(this.mapContainer);
    let Map = null;
    if (mapType === 'mapbox') {
      Map = new MapBox(this.mapContainer, this.get('map'));

    } else {
      Map = new MapProvider(this.mapContainer, this._attrs);
    }
    Map.on('mapLoad', () => {
      this._initEngine(Map.renderDom);
      const sceneMap = new AMap(Map.map);
      Utils.assign(this.__proto__, sceneMap.__proto__);
      this.map = Map.map;
      Map.asyncCamera(this._engine);
            // this._addLight();
      this.initLayer();
        //   this.zoomAsync();
      this.emit('load');
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
  addImage() {
    this.image = new LoadImage();
  }
  _initEvent() {

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
