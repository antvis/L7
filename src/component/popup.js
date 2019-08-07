import Base from '../core/base';
import { bindAll } from '../util/event';
import * as DOM from '../util/dom';
export default class Popup extends Base {
  constructor(cfg) {
    super({
      closeButton: true,
      closeOnClick: true,
      maxWidth: '240px',
      anchor: 'bottom',
      ...cfg
    });
    bindAll([ '_update', '_onClickClose', 'remove' ], this);
  }
  addTo(scene) {
    this._scene = scene;
    if (this.get('closeOnClick')) {
      this._scene.on('click', this._onClickClose);
    }
    this._scene.on('mapmove', this._update);
    this._update();
  }
  setLnglat(lngLat) {
    this.lngLat = lngLat;
    if (this._scene) {
      this._scene.on('mapmove', this._update);
    }
    this._update(lngLat);
    return this;
  }
  _update() {
    const hasPosition = this.lngLat;
    if (!this._scene || !hasPosition || !this._content) { return; }
    if (!this._container) {
      this._container = this.creatDom('div', 'l7-popup', this._scene.getContainer());
      // this._tip = this.creatDom('div', 'l7-popup-tip', this._container);
      this._container.appendChild(this._content);
      if (this.get('className')) {
        this.get('className').split(' ').forEach(name =>
              this._container.classList.add(name));
      }
    }
    if (this.get('maxWidth') && this._container.style.maxWidth !== this.get('maxWidth')) {
      this._container.style.maxWidth = this.get('maxWidth');
    }

    this._updatePosition();
  }
  _updatePosition() {
    if (!this._scene) { return; }
    const pos = this._scene.lngLatToContainer(this.lngLat);
    this._container.style.left = pos.x + 'px';
    this._container.style.top = pos.y + 'px';
  }
  setHTML(html) {
    const frag = window.document.createDocumentFragment();
    const temp = window.document.createElement('body');
    let child;
    temp.innerHTML = html;
    while (true) {  // eslint-disable-line
      child = temp.firstChild;
      if (!child) break;
      frag.appendChild(child);
    }

    return this.setDOMContent(frag);
  }
  setText(text) {
    return this.setDOMContent(window.document.createTextNode(text));
  }
  setMaxWidth(maxWidth) {
    this.set('maxWidth', maxWidth);
    this._update();
    return this;
  }
  setDOMContent(htmlNode) {
    this._createContent();
    this._content.appendChild(htmlNode);
    this._update();
    return this;
  }
  _createContent() {
    if (this._content) {
      DOM.remove(this._content);
    }
    this._content = DOM.create('div', 'l7-popup-content', this._container);
    if (this.get('closeButton')) {
      this._closeButton = DOM.create('button', 'l7-popup-close-button', this._content);
      this._closeButton.type = 'button';
      this._closeButton.setAttribute('aria-label', 'Close popup');
      this._closeButton.innerHTML = '&#215;';
      this._closeButton.addEventListener('click', this._onClickClose);
    }
  }
  _onClickClose() {
    this.remove();
  }
  creatDom(tagName, className, container) {
    const el = window.document.createElement(tagName);
    if (className !== undefined) el.className = className;
    if (container) container.appendChild(el);
    return el;
  }
  removeDom(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  // 移除popup
  remove() {
    if (this._content) {
      this.removeDom(this._content);
    }

    if (this._container) {
      this.removeDom(this._container);
      delete this._container;
    }
    if (this._scene) {
      this._scene.off('mapmove', this._update);
      this._scene.off('click', this._onClickClose);
      delete this._scene;
    }
    this.emit('close');
    return this;
  }
}
