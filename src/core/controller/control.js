import Util from '../../util';
import * as DOM from '../../util/dom';
export default class Control {
  constructor(cfg) {
    Util.assign(this, cfg);
    this._initControlPos();
  }
  addControl(control) {
    control.addTo(this.scene);
  }
  removeControl(control) {
    control.remove();
    return this;
  }
  _initControlPos() {
    const corners = this._controlCorners = {};
    const l = 'l7-';
    const container = this._controlContainer =
      DOM.create('div', l + 'control-container', this.scene.getContainer());

    function createCorner(vSide, hSide) {
      const className = l + vSide + ' ' + l + hSide;

      corners[vSide + hSide] = DOM.create('div', className, container);
    }

    createCorner('top', 'left');
    createCorner('top', 'right');
    createCorner('bottom', 'left');
    createCorner('bottom', 'right');
  }
  _clearControlPos() {
    for (const i in this._controlCorners) {
      DOM.remove(this._controlCorners[i]);
    }
    DOM.remove(this._controlContainer);
    delete this._controlCorners;
    delete this._controlContainer;
  }
}
