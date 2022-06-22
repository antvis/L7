import { bindAll, DOM, lnglatDistance } from '@antv/l7-utils';
import { IScaleControlOption } from '../interface';
import Control, { PositionType } from './BaseControl';

export default class Scale extends Control {
  private mScale: HTMLElement;
  private iScale: HTMLElement;
  constructor(cfg?: Partial<IScaleControlOption>) {
    super(cfg);
    bindAll(['update'], this);
  }

  public getDefault() {
    return {
      position: PositionType.BOTTOMLEFT,
      maxWidth: 100,
      metric: true,
      updateWhenIdle: false,
      imperial: false,
      name: 'scale',
    };
  }

  public onAdd() {
    const className = 'l7-control-scale';
    const container = DOM.create('div', className);
    this.addScales(className + '-line', container);
    const { updateWhenIdle } = this.controlOption;
    // TODO: 高德地图和MapBox地图事件不一致问题
    // 高德zoomchange
    this.mapsService.on(updateWhenIdle ? 'moveend' : 'mapmove', this.update);
    this.mapsService.on(updateWhenIdle ? 'zoomend' : 'zoomchange', this.update);
    this.update();

    return container;
  }
  public onRemove() {
    const { updateWhenIdle } = this.controlOption;
    this.mapsService.off(
      updateWhenIdle ? 'zoomend' : 'zoomchange',
      this.update,
    );
    this.mapsService.off(updateWhenIdle ? 'moveend' : 'mapmove', this.update);
  }
  public update() {
    const mapsService = this.mapsService;
    const { maxWidth } = this.controlOption;
    const y = mapsService.getSize()[1] / 2;

    const p1 = mapsService.containerToLngLat([0, y]);
    const p2 = mapsService.containerToLngLat([maxWidth, y]);
    const maxMeters = lnglatDistance([p1.lng, p1.lat], [p2.lng, p2.lat]);
    this.updateScales(maxMeters);
  }
  public updateScales(maxMeters: number) {
    const { metric, imperial } = this.controlOption;
    if (metric && maxMeters) {
      this.updateMetric(maxMeters);
    }
    if (imperial && maxMeters) {
      this.updateImperial(maxMeters);
    }
  }
  private updateMetric(maxMeters: number) {
    const meters = this.getRoundNum(maxMeters);
    const label = meters < 1000 ? meters + ' m' : meters / 1000 + ' km';
    this.updateScale(this.mScale, label, meters / maxMeters);
  }
  private updateImperial(maxMeters: number) {
    const maxFeet = maxMeters * 3.2808399;
    let maxMiles: number;
    let miles: number;
    let feet: number;

    if (maxFeet > 5280) {
      maxMiles = maxFeet / 5280;
      miles = this.getRoundNum(maxMiles);
      this.updateScale(this.iScale, miles + ' mi', miles / maxMiles);
    } else {
      feet = this.getRoundNum(maxFeet);
      this.updateScale(this.iScale, feet + ' ft', feet / maxFeet);
    }
  }
  private updateScale(scale: HTMLElement, text: string, ratio: number) {
    const { maxWidth } = this.controlOption;
    scale.style.width = Math.round(maxWidth * ratio) + 'px';
    scale.innerHTML = text;
  }
  private getRoundNum(num: number) {
    const pow10 = Math.pow(10, (Math.floor(num) + '').length - 1);
    let d = num / pow10;

    d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

    return pow10 * d;
  }
  private addScales(className: string, container: HTMLElement) {
    const { metric, imperial } = this.controlOption;
    if (metric) {
      this.mScale = DOM.create('div', className, container);
    }
    if (imperial) {
      this.iScale = DOM.create('div', className, container);
    }
  }
}
