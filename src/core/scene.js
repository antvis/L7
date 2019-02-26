import Engine from './engine';
import { LAYER_MAP } from '../layer';
import Base from './base';
import LoadImage from './image';
import WorkerPool from './worker';
import { MapProvider } from '../map/provider';
import GaodeMap from '../map/gaodeMap';
import Global from '../global';
import { compileBuiltinModules } from '../geom/shader';
export default class Scene extends Base {
  getDefaultCfg() {
    return Global.scene;
  }
  constructor(cfg) {
    super(cfg);
    this._initMap();
    // this._initAttribution(); // 暂时取消，后面作为组件去加载
    this.addImage();
    this._layers = [];
  }

  _initEngine(mapContainer) {
    this._engine = new Engine(mapContainer, this);
    this._engine.run();
    this.workerPool = new WorkerPool();
    compileBuiltinModules();
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
      // eslint-disable-next-line
      Object.getOwnPropertyNames(sceneMap.__proto__).forEach((key)=>{
         // eslint-disable-next-line
        if ('key' !== 'constructor') { this.__proto__[key] = sceneMap.__proto__[key]; }
      });
      this.map = Map.map;
      Map.asyncCamera(this._engine);
      this.initLayer();
      this._registEvents();
      this.emit('loaded');
    });

  }
  initLayer() {
    for (const key in LAYER_MAP) {
      Scene.prototype[key] = cfg => {
        const layer = new LAYER_MAP[key](this, cfg);
        this._layers.push(layer);
        return layer;
      };
    }

  }
  on(type, hander) {
    if (this.map) { this.map.on(type, hander); }
    super.on(type, hander);
  }
  off(type, hander) {
    if (this.map) { this.map.off(type, hander); }

    super.off(type, hander);
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
  _addLayer() {

  }
  _registEvents() {
    const events = [
      'mouseout',
      'mouseover',
      'mousemove',
      'mousedown',
      'mouseleave',
      'mouseup',
      'rightclick',
      'click',
      'dblclick'
    ];
    events.forEach(event => {

      this._container.addEventListener(event, e => {
        // 要素拾取
        this._engine._picking.pickdata(e);
      }, false);
    });
  }
  removeLayer(layer) {
    const layerIndex = this._layers.indexOf(layer);
    if (layerIndex > -1) {
      this._layers.splice(layerIndex, 1);
    }
    layer.destroy();
    layer = null;
  }

}
