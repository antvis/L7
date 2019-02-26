
import { getMap } from '../../map';
import Base from '../base';
export default class MapContorller extends Base {
  constructor(cfg, engine, scene) {
    super(cfg);
    this._engine = engine;
    this.scene = scene;
  }
  _init() {
    const mapType = this.get('mapType');
    const mapCfg = this.get('mapCfg');
    this.map = new getMap(mapType)(mapCfg);
    this.map('mapLoad', this._mapload.bind(this));
  }
  _mapload() {
    this.map.asyncCamera(this._engine);
    this.emit('loaded');
  }
  _bindMapMethod() {

  }

}
