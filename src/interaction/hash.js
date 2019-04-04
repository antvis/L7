import Interaction from './base';
import throttle from '@antv/util/src/throttle.js';
export default class Hash extends Interaction {
  constructor(cfg) {
    super({
      endEvent: 'camerachange',
      ...cfg
    });
    window.addEventListener('hashchange', this._onHashChange.bind(this), false);
    this._updateHash = throttle(this._updateHashUnthrottled.bind(this), 20 * 1000 / 100);
  }
  end() {
    this._updateHash();
  }
  reset() {
    this.layer._resetStyle();
  }
  _getHashString() {
    const center = this.layer.getCenter(),
      zoom = Math.round(this.layer.getZoom() * 100) / 100,
      // derived from equation: 512px * 2^z / 360 / 10^d < 0.5px
      precision = Math.ceil((zoom * Math.LN2 + Math.log(512 / 360 / 0.5)) / Math.LN10),
      m = Math.pow(10, precision),
      lng = Math.round(center.lng * m) / m,
      lat = Math.round(center.lat * m) / m,
      bearing = this.layer.getRotation(),
      pitch = this.layer.getPitch();
    let hash = '';
    hash += `#${zoom}/${lat}/${lng}`;
    if (bearing || pitch) hash += (`/${Math.round(bearing * 10) / 10}`);
    if (pitch) hash += (`/${Math.round(pitch)}`);
    return hash;
  }
  _onHashChange() {
    const loc = window.location.hash.replace('#', '').split('/');
    if (loc.length >= 3) {
      this.layer.setStatus({
        center: [ +loc[2], +loc[1] ],
        zoom: +loc[0],
        bearing: +(loc[3] || 0),
        pitch: +(loc[4] || 0)
      });
      return true;
    }
    return false;
  }
  _updateHashUnthrottled() {
    const hash = this._getHashString();
    window.history.replaceState(window.history.state, '', hash);
  }
  destory() {
    window.removeEventListener('hashchange', this._onHashChange, false);
    this.layer.off('camerachange', this._updateHash);
    clearTimeout(this._updateHash());

    return this;
  }
}
