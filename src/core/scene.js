import Engine from './engine';
import { LAYER_MAP } from '../layer';
import Base from './base';
import LoadImage from './image';
import FontAtlasManager from '../geom/buffer/point/text/font-manager';
// import WorkerPool from './worker';
// import { MapProvider } from '../map/AMap';
import { getMap } from '../map/index';
import Global from '../global';
import { getInteraction } from '../interaction/index';
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
    this.fontAtlasManager = new FontAtlasManager();
    this._layers = [];
    this.animateCount = 0;
  }

  _initEngine(mapContainer) {
    this._engine = new Engine(mapContainer, this);
    this.registerMapEvent();
    // this._engine.run();
    // this.workerPool = new WorkerPool();
    compileBuiltinModules();
  }
  // 为pickup场景添加 object 对象
  addPickMesh(object) {
    this._engine._picking.add(object);
  }
  _initMap() {
    this.mapContainer = this.get('id');
    this.mapType = this.get('mapType') || 'amap';
    const MapProvider = getMap(this.mapType);
    const Map = new MapProvider(this._attrs);
    Map.mixMap(this);
    this._container = Map.container;
    // const Map = new MapProvider(this.mapContainer, this._attrs);
    Map.on('mapLoad', () => {
      this.map = Map.map;
      this._initEngine(Map.renderDom);
      Map.asyncCamera(this._engine);
      this.initLayer();
      this._registEvents();
      const hash = this.get('hash');
      if (hash) {
        const Ctor = getInteraction('hash');
        const interaction = new Ctor({ layer: this });
        interaction._onHashChange();
      }
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
        e.pixel || (e.pixel = e.point);
        requestAnimationFrame(() => {
          this._engine._picking.pickdata(e);
        });
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
  startAnimate() {
    if (this.animateCount === 0) {
      this.unRegsterMapEvent();
      this._engine.run();
    }
    this.animateCount++;
  }
  stopAnimate() {
    if (this.animateCount === 1) {
      this._engine.stop();
      this.registerMapEvent();
    }
    this.animateCount++;
  }
  // 地图状态变化时更新可视化渲染
  registerMapEvent() {
    this._updateRender = () => this._engine.update();
    this.map.on('mousemove', this._updateRender);
    this.map.on('mapmove', this._updateRender);
    this.map.on('camerachange', this._updateRender);
  }
  unRegsterMapEvent() {
    this.map.off('mousemove', this._updateRender);
    this.map.off('mapmove', this._updateRender);
    this.map.off('camerachange', this._updateRender);
  }

}
