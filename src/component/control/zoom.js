import Control from './base';
import * as DOM from '../../util/dom';
import { bindAll } from '../../util/event';
export default class Zoom extends Control {
  constructor(cfg) {
    super({
      position: 'topleft',
      zoomInText: '+',
      zoomInTitle: 'Zoom in',
      zoomOutText: '&#x2212;',
      zoomOutTitle: 'Zoom out',
      ...cfg
    });
    bindAll([ '_updateDisabled', '_zoomIn', '_zoomOut' ], this);
  }
  onAdd() {
    const zoomName = 'l7-control-zoom';
    const container = DOM.create('div', zoomName + ' l7-bar');

    this._zoomInButton = this._createButton(this.get('zoomInText'), this.get('zoomInTitle'),
      zoomName + '-in', container, this._zoomIn);
    this._zoomOutButton = this._createButton(this.get('zoomOutText'), this.get('zoomOutTitle'),
      zoomName + '-out', container, this._zoomOut);
    this._updateDisabled();
    this._scene.on('zoomend', this._updateDisabled);
    this._scene.on('zoomchange', this._updateDisabled);
    return container;
  }
  onRemove() {
    this._scene.off('zoomend', this._updateDisabled);
    this._scene.off('zoomchange', this._updateDisabled);
  }
  disable() {
    this._disabled = true;
    this._updateDisabled();
    return this;
  }
  enable() {
    this._disabled = false;
    this._updateDisabled();
    return this;
  }
  _zoomIn() {
    if (!this._disabled && this._scene.getZoom() < this._scene.get('maxZoom')) {
      this._scene.zoomIn();
    }
  }
  _zoomOut() {
    if (!this._disabled && this._scene.getZoom() > this._scene.get('minZoom')) {
      this._scene.zoomOut();
    }
  }
  _createButton(html, tile, className, container, fn) {
    const link = DOM.create('a', className, container);
    link.innerHTML = html;
    link.href = '#';
    link.tile = tile;
    link.addEventListener('click', fn);
    return link;
  }
  _updateDisabled() {
    const scene = this._scene;
    const className = 'l7-disabled';
    DOM.removeClass(this._zoomInButton, className);
    DOM.removeClass(this._zoomOutButton, className);

    if (this._disabled || scene.getZoom() === scene.get('minZoom')) {
      DOM.addClass(this._zoomOutButton, className);
    }
    if (this._disabled || scene._zoom === scene.get('maxZoom')) {
      DOM.addClass(this._zoomInButton, className);
    }
  }
}
