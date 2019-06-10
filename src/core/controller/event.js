import Util from '../../util';
export default class EventContoller {
  constructor(cfg) {
    Util.assign(this, cfg);
  }
  _init() {
    this.layer.scene.on('pick-' + this.layer.layerId, e => {
      let { featureId, point2d, type } = e;
      if (featureId < 0 && this._activeIds !== null) {
        type = 'mouseleave';
      }
      this._activeIds = featureId;
      // TODO 瓦片图层获取选中数据信息
      const lnglat = this.layer.scene.containerToLngLat(point2d);
      const { feature, style } = this.layer.getSelectFeature(featureId, lnglat);
      // const style = this.layerData[featureId - 1];
      const target = {
        featureId,
        feature,
        style,
        pixel: point2d,
        type,
        lnglat: { lng: lnglat.lng, lat: lnglat.lat }
      };
      if (featureId >= 0 || this._activeIds >= 0) { // 拾取到元素，或者离开元素
        this.layer.emit(type, target);
      }

    });
  }
  _initMapEvent() {

  }
}
