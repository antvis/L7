import Control from './base';
import * as DOM from '../../util/dom';
export default class Attribution extends Control {
  constructor(cfg) {
    super({
      position: 'bottomright',
      prefix: '<a href="https://antv.alipay.com/zh-cn/l7/1.x/index.html" title="地理空间数据可视化引擎">AntV L7</a>',
      ...cfg
    });
    this._attributions = {};
  }
  onAdd(scene) {
    scene.attributionControl = this;
    this._container = DOM.create('div', 'l7-control-attribution');
    const layers = scene.getLayers();
    for (const i in layers) {
      if (layers[i].get('attribution')) {
        this.addAttribution(layers[i].get('attribution'));
      }
    }

    this._update();

    return this._container;
  }

  setPrefix(prefix) {
    this.set('prefix', prefix);
    this._update();
    return this;
  }
  addAttribution(text) {
    if (!text) { return this; }

    if (!this._attributions[text]) {
      this._attributions[text] = 0;
    }
    this._attributions[text]++;

    this._update();

    return this;
  }

  removeAttribution(text) {
    if (!text) { return this; }

    if (this._attributions[text]) {
      this._attributions[text]--;
      this._update();
    }

    return this;
  }
  _update() {
    if (!this._scene) { return; }

    const attribs = [];

    for (const i in this._attributions) {
      if (this._attributions[i]) {
        attribs.push(i);
      }
    }
    const prefixAndAttribs = [];
    if (this.get('prefix')) {
      prefixAndAttribs.push(this.get('prefix'));
    }
    if (attribs.length) {
      prefixAndAttribs.push(attribs.join(', '));
    }
    this._container.innerHTML = prefixAndAttribs.join(' | ');
  }

}
