import { PositionType } from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { createL7Icon } from '../utils/icon';
import { Control, IControlOption } from './baseControl';

export interface IZoomControlOption extends IControlOption {
  zoomInText: DOM.ELType | string;
  zoomInTitle: string;
  zoomOutText: DOM.ELType | string;
  zoomOutTitle: string;
}

export { Zoom };

export default class Zoom extends Control<IZoomControlOption> {
  private disabled: boolean;
  private zoomInButton: HTMLElement;
  private zoomOutButton: HTMLElement;

  public getDefault(option: Partial<IZoomControlOption>) {
    return {
      ...super.getDefault(option),
      position: PositionType.BOTTOMRIGHT,
      name: 'zoom',
      zoomInText: createL7Icon('l7-icon-enlarge'),
      zoomInTitle: 'Zoom in',
      zoomOutText: createL7Icon('l7-icon-narrow'),
      zoomOutTitle: 'Zoom out',
    };
  }
  public setOptions(newOptions: Partial<IZoomControlOption>) {
    super.setOptions(newOptions);
    if (
      this.checkUpdateOption(newOptions, [
        'zoomInText',
        'zoomInTitle',
        'zoomOutText',
        'zoomOutTitle',
      ])
    ) {
      this.resetButtonGroup(this.container);
    }
  }

  public onAdd(): HTMLElement {
    const container = DOM.create('div', 'l7-control-zoom');
    this.resetButtonGroup(container);
    this.mapsService.on('zoomend', this.updateDisabled);
    this.mapsService.on('zoomchange', this.updateDisabled);
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

  public zoomIn = () => {
    if (
      !this.disabled &&
      this.mapsService.getZoom() < this.mapsService.getMaxZoom()
    ) {
      this.mapsService.zoomIn();
    }
  };

  public zoomOut = () => {
    if (
      !this.disabled &&
      this.mapsService.getZoom() > this.mapsService.getMinZoom()
    ) {
      this.mapsService.zoomOut();
    }
  };

  private resetButtonGroup(container: HTMLElement) {
    DOM.clearChildren(container);
    this.zoomInButton = this.createButton(
      this.controlOption.zoomInText,
      this.controlOption.zoomInTitle,
      'l7-button-control',
      container,
      this.zoomIn,
    );
    this.zoomOutButton = this.createButton(
      this.controlOption.zoomOutText,
      this.controlOption.zoomOutTitle,
      'l7-button-control',
      container,
      this.zoomOut,
    );
    this.updateDisabled();
  }

  private createButton(
    html: DOM.ELType | string,
    tile: string,
    className: string,
    container: HTMLElement,
    fn: (...arg: any[]) => any,
  ) {
    const link = DOM.create('button', className, container) as HTMLLinkElement;
    if (typeof html === 'string') {
      link.innerHTML = html;
    } else {
      link.append(html);
    }
    link.title = tile;
    link.addEventListener('click', fn);
    return link;
  }

  private updateDisabled = () => {
    const mapsService = this.mapsService;
    this.zoomInButton.removeAttribute('disabled');
    this.zoomOutButton.removeAttribute('disabled');
    if (this.disabled || mapsService.getZoom() <= mapsService.getMinZoom()) {
      this.zoomOutButton.setAttribute('disabled', 'true');
    }
    if (this.disabled || mapsService.getZoom() >= mapsService.getMaxZoom()) {
      this.zoomInButton.setAttribute('disabled', 'true');
    }
  };
}
