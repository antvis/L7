import Util from '../../util';
export default class EventContoller {
  constructor(cfg) {
    Util.assign(this, cfg);
    this._init();
    this.startPoint = { x: -1, y: -1 };
    this._selectedId = null;
  }
  _init() {
    this.layer.scene.on('pick-' + this.layer.layerId, e => {

      let { featureId, point2d, type } = e;
      if (type === 'click') {
        return;
      }
      if (type === 'mousedown') {
        this.startPoint = point2d;
      }
      if (type === 'mouseup') {
        this.endPoint = point2d;
        if (this.startPoint.x - this.endPoint.x === 0 && this.startPoint.y - this.endPoint.y === 0) {
          type = 'click';
        }
      }
      // TODO 瓦片图层获取选中数据信息
      const lnglat = this.layer.scene.containerToLngLat(point2d);
      let feature = null;
      let style = null;
      if (featureId !== -999) {
        const res = this.layer.getSelectFeature(featureId, lnglat);
        feature = res.feature;
        style = res.style;
      }
      const target = {
        featureId,
        feature,
        style,
        pixel: point2d,
        type,
        lnglat: { lng: lnglat.lng, lat: lnglat.lat }
      };
      if (featureId >= 0) { // 拾取到元素，或者离开元素
        this.layer.emit(type, target);
        this._selectedId = featureId;
      }
      if (featureId < 0 && this._selectedId != null) {
        type = 'mouseleave';
        this.layer.emit(type, target);
        this._selectedId = null;
      }
      this.layer._activeIds = featureId;

    });
  }
  _initMapEvent() {

  }
}
