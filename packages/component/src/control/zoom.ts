import { bindAll, DOM } from '@antv/l7-utils';
import { IZoomControlOption } from '../interface';
import Control, { PositionType } from './BaseControl';

export default class Zoom extends Control {
  private disabled: boolean;
  private zoomInButton: HTMLElement;
  private zoomOutButton: HTMLElement;

  constructor(cfg?: Partial<IZoomControlOption>) {
    super(cfg);
    bindAll(['updateDisabled', 'zoomIn', 'zoomOut'], this);
  }
  public getDefault() {
    return {
      position: PositionType.TOPLEFT,
      zoomInText: '+',
      zoomInTitle: 'Zoom in',
      zoomOutText: '&#x2212;',
      zoomOutTitle: 'Zoom out',
      name: 'zoom',
    };
  }

  public onAdd(): HTMLElement {
    const zoomName = 'l7-control-zoom';
    const container = DOM.create('div', zoomName + ' l7-bar');

    this.zoomInButton = this.createButton(
      this.controlOption.zoomInText,
      this.controlOption.zoomInTitle,
      zoomName + '-in',
      container,
      this.zoomIn,
    );
    this.zoomOutButton = this.createButton(
      this.controlOption.zoomOutText,
      this.controlOption.zoomOutTitle,
      zoomName + '-out',
      container,
      this.zoomOut,
    );
    this.mapsService.on('zoomend', this.updateDisabled);
    this.mapsService.on('zoomchange', this.updateDisabled);
    this.updateDisabled();
    return container;
  }

  public onRemove() {
    this.mapsService.off('zoomend', this.updateDisabled);
    this.mapsService.off('zoomchange', this.updateDisabled);
  }

  public disable() {
    this.disabled = true;
    this.updateDisabled();
    return this;
  }

  public enable() {
    this.disabled = false;
    this.updateDisabled();
    return this;
  }

  private zoomIn() {
    if (
      !this.disabled &&
      this.mapsService.getZoom() < this.mapsService.getMaxZoom()
    ) {
      this.mapsService.zoomIn();
    }
  }
  private zoomOut() {
    if (
      !this.disabled &&
      this.mapsService.getZoom() > this.mapsService.getMinZoom()
    ) {
      this.mapsService.zoomOut();
    }
  }
  private createButton(
    html: string,
    tile: string,
    className: string,
    container: HTMLElement,
    fn: (...arg: any[]) => any,
  ) {
    const link = DOM.create('a', className, container) as HTMLLinkElement;
    link.innerHTML = html;
    link.title = tile;
    link.href = 'javascript:void(0)';
    link.addEventListener('click', fn);
    return link;
  }
  private updateDisabled() {
    const mapsService = this.mapsService;
    const className = 'l7-disabled';
    DOM.removeClass(this.zoomInButton, className);
    DOM.removeClass(this.zoomOutButton, className);
    if (this.disabled || mapsService.getZoom() <= mapsService.getMinZoom()) {
      DOM.addClass(this.zoomOutButton, className);
    }
    if (this.disabled || mapsService.getZoom() >= mapsService.getMaxZoom()) {
      DOM.addClass(this.zoomInButton, className);
    }
  }
}
