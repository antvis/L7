import Engine from './engine';
import * as layers from '../layer';
import Base from './base';
import ImageData from './image';
import ModelData from './model';
import { MapProvider } from '../map/provider';
import { MapBox } from '../map/mapbox';
/**
 *  const scene = new L7.Scene({
 *      container:'',
 *
 *      map:{
 *      }
 *    })
 */
export default class Scene extends Base {
  getDefaultCfg() {
    return {
      mapType: 'AMAP'
    };
  }
  constructor(cfg) {
    super(cfg);
    this.mapContainer = this.get('id');
    this.layers = [];
    this.render = new Render();
    this._engine = new Engine(this.mapContainer);
    this.initMap();
    this.addImage();
    this.addModel(this.render);

  }
  initMap() {
    const mapType = this.mapType = this.get('mapType');
    let Map = null;
    if (mapType === 'mapbox') {
      Map = new MapBox(this.mapContainer, this.get('map'));

    } else {
      Map = new MapProvider(this.mapContainer, this.get('map'));
    }
    Map.on('mapLoad', () => {
      this.renderCanvas = Map.canvas;
      this.map = Map.map;
      this.render.initScene(this.renderCanvas);
      this.addModel();
      Map.asyncCamera(this.render.camera, this.render.cameraNode, this.render.layerNode);
      this.initLayer();
      this.zoomAsync();
      this.emit('load');
    });

  }
  initLayer() {
    for (const methodName in layers) {
      this[methodName] = cfg => {
        cfg ? cfg.mapType = this.mapType : cfg = { mapType: this.mapType };
        const layer = new layers[methodName](this, cfg);
        this.layers.push(layer);
        return layer;
      };
    }
  }
  removeLayer(layer) {
    layer.layerNode.destroy();
    this.layers = this.layers.filter(item => {
      return item.layerId != layer.layerId;
    });
  }
  getLayers() {
    return this.layers;
  }
  getLayer() {

  }
  addImage() {
    this.image = new ImageData();
  }
  addModel() {
    this.Model = new ModelData(this.render);
  }
  zoomAsync() {
    this.map.on('zoomend', () => {
      this.layers.forEach(layer => {
        const id = layer.layerId;
        const layerNode = this.render.layerNode.findChildByName(id);
        const zoom = this.map.getZoom();
        const minZoom = layer.get('minZoom');
        const maxZoom = layer.get('maxZoom');
        if (zoom < minZoom || zoom > maxZoom) {
          layerNode.isActive = false;
        } else {
          layerNode.isActive = true;
        }

      });
    });
  }


}
