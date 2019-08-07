import Control from './base';
import * as DOM from '../../util/dom';
import { bindAll } from '../../util/event';
export default class Layers extends Control {
  constructor(cfg) {
    super({
      collapsed: true,
      position: 'topright',
      autoZIndex: true,
      hideSingleBase: false,
      sortLayers: false,
      ...cfg
    });
    this._layerControlInputs = [];
    this._layers = [];
    this._lastZIndex = 0;
    this._handlingClick = false;
    const baseLayers = this.get('baseLayers');
    const overlays = this.get('overlayers');
    for (const i in baseLayers) {
      this._addLayer(baseLayers[i], i);
    }

    for (const i in overlays) {
      this._addLayer(overlays[i], i, true);
    }
    bindAll([ '_checkDisabledLayers', '_onLayerChange', 'collapse', 'extend', 'expand', '_onInputClick' ], this);
  }

  onAdd(scene) {
    this._initLayout();
    this._update();
    this._scene = scene;
    scene.on('zoomend', this._checkDisabledLayers, this);

    for (let i = 0; i < this._layers.length; i++) {
      this._layers[i].layer.on('remove', this._onLayerChange);
      this._layers[i].layer.on('add', this._onLayerChange);
    }

    return this._container;
  }
  addTo(scene) {
    super.addTo(scene);
  }

  addVisualLayer(layer, name) {
    this._addLayer(layer, name, true);
    return (this._scene) ? this._update() : this;
  }

  _initLayout() {
    const className = 'l7-control-layers',
      container = this._container = DOM.create('div', className),
      collapsed = this.get('collapsed');
    
    // makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
    container.setAttribute('aria-haspopup', true);


    const form = this._form = DOM.create('form', className + '-list');

    if (collapsed) {
      this._scene.on('click', this.collapse);
      container.addEventListener('mouseenter', this.expand);
      container.addEventListener('mouseleave', this.collapse);

    }

    const link = this._layersLink = DOM.create('a', className + '-toggle', container);
    link.href = '#';
    link.title = 'Layers';
    if (!collapsed) {
      this.expand();
    }

    this._baseLayersList = DOM.create('div', className + '-base', form);
    this._separator = DOM.create('div', className + '-separator', form);
    this._overlaysList = DOM.create('div', className + '-overlays', form);

    container.appendChild(form);
  }

  _update() {
    if (!this._container) { return this; }

    DOM.empty(this._baseLayersList);
    DOM.empty(this._overlaysList);

    this._layerControlInputs = [];
    let baseLayersPresent,
      overlaysPresent,
      i,
      obj,
      baseLayersCount = 0;

    for (i = 0; i < this._layers.length; i++) {
      obj = this._layers[i];
      this._addItem(obj);
      overlaysPresent = overlaysPresent || obj.overlay;
      baseLayersPresent = baseLayersPresent || !obj.overlay;
      baseLayersCount += !obj.overlay ? 1 : 0;
    }

    // Hide base layers section if there's only one layer.
    if (this.get('hideSingleBase')) {
      baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
      this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
    }

    this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

    return this;
  }

  expand() {
    DOM.addClass(this._container, 'l7-control-layers-expanded');
    this._form.style.height = null;
    const acceptableHeight = this._scene.getSize().height - (this._container.offsetTop + 50);
    if (acceptableHeight < this._form.clientHeight) {
      DOM.addClass(this._form, 'l7-control-layers-scrollbar');
      this._form.style.height = acceptableHeight + 'px';
    } else {
      DOM.removeClass(this._form, 'l7-control-layers-scrollbar');
    }
    this._checkDisabledLayers();
    return this;
  }

  collapse() {
    DOM.removeClass(this._container, 'l7-control-layers-expanded');
    return this;
  }

  _checkDisabledLayers() {
    const inputs = this._layerControlInputs;
    let input,
      layer;
    const zoom = this._scene.getZoom();

    for (let i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];
      layer = this._scene.getLayer(input.layerId);
      input.disabled = (layer.get('minZoom') !== undefined && zoom < layer.get('minZoom')) ||
        (zoom < layer.get('maxZoom') !== undefined && zoom > layer.get('maxZoom'));

    }
  }

  _addLayer(layer, name, overlay) {
    if (this._scene) {
      layer.on('add', this._onLayerChange);
      layer.on('remove', this._onLayerChange);
    }
    this._layers.push({
      layer,
      name,
      overlay
    });

    if (this.get('sortLayers')) {
      this._layers.sort((a, b) => {
        return this.get('sortFunction')(a.layer, b.layer, a.name, b.name);
      });
    }

    if (this.get('autoZIndex') && layer.setZIndex) {
      this._lastZIndex++;
      layer.setZIndex(this._lastZIndex);
    }

    this._expandIfNotCollapsed();
  }

  _expandIfNotCollapsed() {
    if (this._scene && !this.get('collapsed')) {
      this.expand();
    }
    return this;
  }

  _onLayerChange(e) {
    if (!this._handlingClick) {
      this._update();
    }

    const obj = this._scene.getLayer(e.target.layerId);

    const type = obj.overlay ?
      (e.type === 'add' ? 'overlayadd' : 'overlayremove') :
      (e.type === 'add' ? 'baselayerchange' : null);

    if (type) {
      this._map.fire(type, obj);
    }
  }

  _createRadioElement(name, checked) {

    const radioHtml = '<input type="radio" class="l7-control-layers-selector" name="' +
      name + '"' + (checked ? ' checked="checked"' : '') + '/>';

    const radioFragment = document.createElement('div');
    radioFragment.innerHTML = radioHtml;

    return radioFragment.firstChild;
  }

  _addItem(obj) {
    const label = document.createElement('label'),
      checked = !!this._scene.getLayer(obj.layer.layerId);
    let input;

    if (obj.overlay) {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'l7-control-layers-selector';
      input.defaultChecked = checked;
    } else {
      input = this._createRadioElement('l7-base-layers', checked);
    }
    this._layerControlInputs.push(input);
    input.layerId = obj.layer.layerId;
    input.addEventListener('click', this._onInputClick);

    const name = document.createElement('span');
    name.innerHTML = ' ' + obj.name;

    const holder = document.createElement('div');

    label.appendChild(holder);
    holder.appendChild(input);
    holder.appendChild(name);

    const container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(label);

    this._checkDisabledLayers();
    return label;

  }
  _onInputClick() {
    const inputs = this._layerControlInputs;
    let input,
      layer;
    const addedLayers = [],
      removedLayers = [];
    this._handlingClick = true;
    for (let i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];
      layer = this._scene.getLayer(input.layerId);

      if (input.checked) {
        addedLayers.push(layer);
      } else if (!input.checked) {
        removedLayers.push(layer);
      }
    }
    for (let i = 0; i < removedLayers.length; i++) {
      removedLayers[i].hide();
    }
    for (let i = 0; i < addedLayers.length; i++) {
      addedLayers[i].show();
    }

    this._handlingClick = false;

    this._refocusOnMap();

  }


}
