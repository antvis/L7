import { PositionType } from '@antv/l7-core';
import { bindAll, DOM } from '@antv/l7-utils';
import { ILayerControlOption } from '../interface';
import Control from './BaseControl';

interface IInputItem extends HTMLInputElement {
  layerId: string;
}

export default class Layers extends Control {
  private layerControlInputs: any[];
  private layers: any[];
  private lastZIndex: number;
  private handlingClick: boolean;
  private layersLink: HTMLElement;
  private baseLayersList: HTMLElement;
  private separator: HTMLElement;
  private overlaysList: HTMLElement;
  private form: HTMLElement;

  constructor(cfg: Partial<ILayerControlOption>) {
    super(cfg);
    this.layerControlInputs = [];
    this.layers = [];
    this.lastZIndex = 0;
    this.handlingClick = false;
    this.initLayers();

    bindAll(
      [
        'checkDisabledLayers',
        'onLayerChange',
        'collapse',
        'extend',
        'expand',
        'onInputClick',
      ],
      this,
    );
  }

  public getDefault() {
    return {
      collapsed: true,
      position: PositionType.TOPRIGHT,
      autoZIndex: true,
      hideSingleBase: false,
      sortLayers: false,
      name: 'layers',
    };
  }
  public onAdd() {
    this.initLayout();
    this.update();
    this.mapsService.on('zoomend', this.checkDisabledLayers);
    this.layers.forEach((layerItem) => {
      layerItem.layer.on('remove', this.onLayerChange);
      layerItem.layer.on('add', this.onLayerChange);
    });
    return this.container;
  }

  public addVisualLayer(layer: any, name: string | number) {
    this.addLayer(layer, name, true);
    return this.mapsService ? this.update() : this;
  }
  public expand() {
    const { height } = this.renderService.getViewportSize();
    DOM.addClass(this.container, 'l7-control-layers-expanded');
    this.form.style.height = 'null';
    const acceptableHeight = height - (this.container.offsetTop + 50);
    if (acceptableHeight < this.form.clientHeight) {
      DOM.addClass(this.form, 'l7-control-layers-scrollbar');
      this.form.style.height = acceptableHeight + 'px';
    } else {
      DOM.removeClass(this.form, 'l7-control-layers-scrollbar');
    }
    this.checkDisabledLayers();
    return this;
  }

  public collapse() {
    DOM.removeClass(this.container, 'l7-control-layers-expanded');
    return this;
  }

  public onRemove() {
    if (!this.mapsService) {
      return;
    }
    this.mapsService.off('click', this.collapse);
    this.layers.forEach((layerItem) => {
      layerItem.layer.off('remove', this.onLayerChange);
      layerItem.layer.off('add', this.onLayerChange);
    });
  }
  private initLayout() {
    const className = 'l7-control-layers';
    const container = (this.container = DOM.create('div', className));
    const { collapsed } = this.controlOption;
    // makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
    container.setAttribute('aria-haspopup', 'true');
    const form = (this.form = DOM.create(
      'form',
      className + '-list',
    ) as HTMLElement);

    if (collapsed) {
      this.mapsService.on('click', this.collapse);
      container.addEventListener('mouseenter', this.expand);
      container.addEventListener('mouseleave', this.collapse);
    }

    this.layersLink = DOM.create('a', className + '-toggle', container);
    const link = this.layersLink;
    // link.href = '#';
    link.title = 'Layers';
    if (!collapsed) {
      this.expand();
    }
    this.baseLayersList = DOM.create('div', className + '-base', form);
    this.separator = DOM.create('div', className + '-separator', form);
    this.overlaysList = DOM.create('div', className + '-overlays', form);
    container.appendChild(form);
  }
  private initLayers() {
    const { baseLayers = {}, overlayers = {} } = this.controlOption;
    Object.keys(baseLayers).forEach((name: string, index: number) => {
      // baseLayers[name].once('inited', this.update);
      this.addLayer(baseLayers[name], name, false);
    });
    Object.keys(overlayers).forEach((name: any, index: number) => {
      // overlayers[name].once('inited', this.update);
      this.addLayer(overlayers[name], name, true);
    });
  }

  private update() {
    if (!this.container) {
      return this;
    }

    DOM.empty(this.baseLayersList);
    DOM.empty(this.overlaysList);

    this.layerControlInputs = [];
    let baseLayersPresent;
    let overlaysPresent;
    let i;
    let obj;
    let baseLayersCount = 0;

    for (i = 0; i < this.layers.length; i++) {
      obj = this.layers[i];
      this.addItem(obj);
      overlaysPresent = overlaysPresent || obj.overlay;
      baseLayersPresent = baseLayersPresent || !obj.overlay;
      baseLayersCount += !obj.overlay ? 1 : 0;
    }

    // Hide base layers section if there's only one layer.
    if (this.controlOption.hideSingleBase) {
      baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
      this.baseLayersList.style.display = baseLayersPresent ? '' : 'none';
    }

    this.separator.style.display =
      overlaysPresent && baseLayersPresent ? '' : 'none';

    return this;
  }

  private checkDisabledLayers() {
    const inputs = this.layerControlInputs;
    let input: IInputItem;
    let layer;
    const zoom = this.mapsService.getZoom();

    for (let i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];
      layer = this.layerService.getLayer(input.layerId);

      if (layer && layer.inited) {
        const minZoom = layer.getMinZoom();
        const maxZoom = layer.getMaxZoom();

        input.disabled = zoom < minZoom || zoom > maxZoom;
      }
    }
  }

  private addLayer(layer: any, name: string | number, overlay: boolean) {
    if (this.mapsService) {
      layer.on('add', this.onLayerChange);
      layer.on('remove', this.onLayerChange);
    }
    this.layers.push({
      layer,
      name,
      overlay,
    });
    const { sortLayers, sortFunction, autoZIndex } = this.controlOption;
    if (sortLayers) {
      this.layers.sort((a, b) => {
        return sortFunction(a.layer, b.layer, a.name, b.name);
      });
    }

    if (autoZIndex && layer.setZIndex) {
      this.lastZIndex++;
      layer.setZIndex(this.lastZIndex);
    }

    this.expandIfNotCollapsed();
  }

  private expandIfNotCollapsed() {
    if (this.mapsService && !this.controlOption.collapsed) {
      this.expand();
    }
    return this;
  }

  private onLayerChange(e: any) {
    if (!this.handlingClick) {
      this.update();
    }

    const obj = this.layerService.getLayer(e.target.layerId);

    // @ts-ignore
    const type = obj?.overlay
      ? e.type === 'add'
        ? 'overlayadd'
        : 'overlayremove'
      : e.type === 'add'
      ? 'baselayerchange'
      : null;

    if (type) {
      this.emit(type, obj);
    }
  }

  private createRadioElement(name: string, checked: boolean): ChildNode {
    const radioHtml =
      '<input type="radio" class="l7-control-layers-selector" name="' +
      name +
      '"' +
      (checked ? ' checked="checked"' : '') +
      '/>';

    const radioFragment = document.createElement('div');
    radioFragment.innerHTML = radioHtml;

    return radioFragment.firstChild as ChildNode;
  }

  private addItem(obj: any) {
    const label = document.createElement('label');
    const layer = this.layerService.getLayer(obj.layer.id);
    const checked = layer && layer.inited && obj.layer.isVisible();
    let input: IInputItem;
    if (obj.overlay) {
      input = document.createElement('input') as IInputItem;
      input.type = 'checkbox';
      input.className = 'l7-control-layers-selector';
      input.defaultChecked = checked;
    } else {
      input = this.createRadioElement('l7-base-layers', checked) as IInputItem;
    }
    this.layerControlInputs.push(input);
    input.layerId = obj.layer.id;
    input.addEventListener('click', this.onInputClick);

    const name = document.createElement('span');
    name.innerHTML = ' ' + obj.name;

    const holder = document.createElement('div');

    label.appendChild(holder);
    holder.appendChild(input);
    holder.appendChild(name);

    const container = obj.overlay ? this.overlaysList : this.baseLayersList;
    container.appendChild(label);

    this.checkDisabledLayers();
    return label;
  }

  private onInputClick() {
    const inputs = this.layerControlInputs;
    let input;
    let layer;
    const addedLayers = [];
    const removedLayers = [];
    this.handlingClick = true;
    for (let i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];
      layer = this.layerService.getLayer(input.layerId);
      if (input.checked) {
        addedLayers.push(layer);
      } else if (!input.checked) {
        removedLayers.push(layer);
      }
    }
    removedLayers.forEach((l: any) => {
      l.hide();
    });
    addedLayers.forEach((l: any) => {
      l.show();
    });

    this.handlingClick = false;
  }
}
