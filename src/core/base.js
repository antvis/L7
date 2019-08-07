/**
 * @fileOverview Chart、View、Geometry 的基类
 * @author dxq613@gmail.com
 */

import EventEmitter from 'wolfy87-eventemitter';
import Util from '../util';

class Base extends EventEmitter {

  getDefaultCfg() {
    return {};
  }

  constructor(cfg) {
    super();
    const attrs = {
      visible: true
    };
    const defaultCfg = this.getDefaultCfg();
    this._attrs = attrs;
    Util.assign(attrs, defaultCfg, cfg);
  }

  get(name) {
    return this._attrs[name];
  }

  set(name, value) {
    this._attrs[name] = value;
  }
  destroy() {
    this._attrs = {};
    this.removeAllListeners();
    this.destroyed = true;
  }
}

export default Base;
