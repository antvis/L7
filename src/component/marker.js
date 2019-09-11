import Base from '../core/base';
import { bindAll } from '../util/event';
import { applyAnchorClass, anchorTranslate } from '../util/anchor';
import * as DOM from '../util/dom';
export default class Marker extends Base {
  constructor(cfg) {
    super({
      element: '', // DOM element
      anchor: 'bottom',
      offset: [ 0, 0 ],
      color: '#2f54eb',
      draggable: false,
      ...cfg

    });
    bindAll([
      '_update',
      '_onMove',
      '_onUp',
      '_addDragHandler',
      '_onMapClick'
    ], this);
    this._init();
  }
  _init() {
    let element = this.get('element');
    if (!element) {
      this._defaultMarker = true;
      element = DOM.create('div');
      this.set('element', element);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttributeNS(null, 'display', 'block');
      svg.setAttributeNS(null, 'height', '48px');
      svg.setAttributeNS(null, 'width', '48px');
      svg.setAttributeNS(null, 'viewBox', '0 0 1024 1024');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttributeNS(null, 'd', 'M512 490.666667C453.12 490.666667 405.333333 442.88 405.333333 384 405.333333 325.12 453.12 277.333333 512 277.333333 570.88 277.333333 618.666667 325.12 618.666667 384 618.666667 442.88 570.88 490.666667 512 490.666667M512 85.333333C346.88 85.333333 213.333333 218.88 213.333333 384 213.333333 608 512 938.666667 512 938.666667 512 938.666667 810.666667 608 810.666667 384 810.666667 218.88 677.12 85.333333 512 85.333333Z');
      path.setAttributeNS(null, 'fill', this.get('color'));
      svg.appendChild(path);
      element.appendChild(svg);

    }
    DOM.addClass(element, 'l7-marker');
    element.addEventListener('click', e => {
      this._onMapClick(e);
    });
    applyAnchorClass(element, this.get('anchor'), 'marker');

    this._popup = null;

  }
  addTo(scene) {
    this.remove();
    this._scene = scene;
    this._scene.getMarkerContainer().appendChild(this.get('element'));
    this._scene.on('camerachange', this._update);
    this.setDraggable(this.get('draggable'));
    this._update();
    return this;
  }

  remove() {
    if (this._scene) {
      this._scene.off('click', this._onMapClick);
      this._scene.off('move', this._update);
      this._scene.off('moveend', this._update);
      this._scene.off('mousedown', this._addDragHandler);
      this._scene.off('touchstart', this._addDragHandler);
      this._scene.off('mouseup', this._onUp);
      this._scene.off('touchend', this._onUp);
      delete this._scene;
    }
    DOM.remove(this.get('element'));
    if (this._popup) this._popup.remove();
    return this;
  }
  setLnglat(lngLat) {
    this._lngLat = lngLat;
    if (this._popup) this._popup.setLnglat(this._lngLat);
    return this;
  }
  getLnglat() {
    return this._lngLat;
  }

  getElement() {
    return this.get('element');
  }

  setPopup(popup) {
    this._popup = popup;
    if (this._lngLat) this._popup.setLnglat(this._lngLat);
    return this;
  }

  togglePopup() {
    const popup = this._popup;
    if (!popup) return this;
    else if (popup.isOpen()) popup.remove();
    else popup.addTo(this._scene);
    return this;
  }

  getPopup() {
    return this._popup;
  }

  getOffset() {

  }

  setDraggable() {

  }

  isDraggable() {
    return this._draggable;
  }
  _update() {
    if (!this._scene) return;
    this._updatePosition();
    DOM.setTransform(this.get('element'), `${anchorTranslate[ this.get('anchor')]}`);

  }
  _onMapClick() {
    // this._scene.emit('click'); // 触发map点击事件，关闭其他popup
    const element = this.get('element');

    if (this._popup && element) {
      this.togglePopup();
    }
  }
  _updatePosition() {
    if (!this._scene) { return; }
    const pos = this._pos = this._scene.lngLatToContainer(this._lngLat);
    this.get('element').style.left = pos.x + 'px';
    this.get('element').style.top = pos.y + 'px';

  }
  _bubbleUp() {
    const eventsName = [
      'mouseout',
      'mouseover',
      'mousemove',
      'mousedown',
      'mouseleave',
      'mouseup',
      'rightclick',
      'click',
      'dblclick',
      'wheel'
    ];
    const element = this.get('element');
    eventsName.forEach(event => {
      element.addEventListener(event, e => {
        this._scene.emit(event, e);
      });
    });
  }

  _addDragHandler() {

  }
  _onUp() {

  }
}
