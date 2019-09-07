import Base from '../../core/base';
import * as DOM from '../../util/dom';
export default class Control extends Base {
  constructor(cfg) {
    super({
      position: 'topright',
      ...cfg
    });
  }
  setPosition(position) {
    const scene = this._scene;
    if (scene) {
      scene.removeControl(this);
    }
    this.set('position', position);
    if (scene) {
      scene.addControl(this);
    }
    return this;
  }
  getContainer() {
    return this._container;
  }
  addTo(scene) {
    this.remove();
    this.isShow = true;
    this._scene = scene;
    const container = this._container = this.onAdd(scene);
    const pos = this.get('position');
    const corner = scene.get('controlController')._controlCorners[pos];
    DOM.addClass(container, 'l7-control');

    if (pos.indexOf('bottom') !== -1) {
      corner.insertBefore(container, corner.firstChild);
    } else {
      corner.appendChild(container);
    }
    return this;
  }
  hide() {
    const container = this._container;
    DOM.addClass(container, 'l7-control-hide');
    this.isShow = false;
  }
  show() {
    const container = this._container;
    DOM.removeClass(container, 'l7-control-hide');
    this.isShow = true;
  }
  remove() {
    if (!this._scene) {
      return this;
    }
    DOM.remove(this._container);
  }
  _refocusOnMap(e) {
    // if map exists and event is not a keyboard event
    if (this._scene && e && e.screenX > 0 && e.screenY > 0) {
      this._scene.getContainer().focus();
    }
  }

}
