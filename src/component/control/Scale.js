import Control from './base';
import * as DOM from '../../util/dom';
import { toLngLat } from '@antv/geo-coord/lib/geo/geometry/lng-lat';
import { bindAll } from '../../util/event';
export default class Scale extends Control {
  constructor(cfg) {
    super({
      position: 'bottomleft',
      maxWidth: 100,
      metric: true,
      updateWhenIdle: false,
      imperial: false,
      ...cfg
    });
    bindAll([ '_update' ], this);
  }
  onAdd(scene) {
    const className = 'l7-control-scale';
    const container = DOM.create('div', className);
    this._addScales(className + '-line', container);

    scene.on(this.get('updateWhenIdle') ? 'moveend' : 'mapmove', this._update);
    this._update();

    return container;
  }
  onRemove(scene) {
    scene.off(this.get('updateWhenIdle') ? 'moveend' : 'mapmove', this._update);
  }
  _addScales(className, container) {

    if (this.get('metric')) {
      this._mScale = DOM.create('div', className, container);
    }
    if (this.get('imperial')) {
      this._iScale = DOM.create('div', className, container);
    }
  }
  _update() {
    const scene = this._scene;

    const y = this._scene.getSize().height / 2;

    const p1 = scene.containerToLngLat({ x: 0, y });
    const p2 = scene.containerToLngLat({ x: this.get('maxWidth'), y });
    const maxMeters = scene.crs.distance(toLngLat(p1.lng, p1.lat), toLngLat(p2.lng, p2.lat));
    this._updateScales(maxMeters);
  }
  _updateScales(maxMeters) {
    if (this.get('metric') && maxMeters) {
      this._updateMetric(maxMeters);
    }
    if (this.get('imperial') && maxMeters) {
      this._updateImperial(maxMeters);
    }
  }
  _updateMetric(maxMeters) {
    const meters = this._getRoundNum(maxMeters),
      label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';
    this._updateScale(this._mScale, label, meters / maxMeters);
  }
  _updateImperial(maxMeters) {
    const maxFeet = maxMeters * 3.2808399;
    let maxMiles,
      miles,
      feet;

    if (maxFeet > 5280) {
      maxMiles = maxFeet / 5280;
      miles = this._getRoundNum(maxMiles);
      this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);

    } else {
      feet = this._getRoundNum(maxFeet);
      this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
    }
  }
  _updateScale(scale, text, ratio) {
    scale.style.width = Math.round(this.get('maxWidth') * ratio) + 'px';
    scale.innerHTML = text;
  }
  _getRoundNum(num) {
    const pow10 = Math.pow(10, (Math.floor(num) + '').length - 1);
    let d = num / pow10;

    d = d >= 10 ? 10 :
      d >= 5 ? 5 :
        d >= 3 ? 3 :
          d >= 2 ? 2 : 1;

    return pow10 * d;
  }
}
