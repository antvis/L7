import * as _ from '@antv/util';
const EVENT_TYPES = [ 'start', 'process', 'end', 'reset' ];

export default class Interaction {
  constructor(cfg) {
    const defaultCfg = this._getDefaultCfg();
    Object.assign(this, defaultCfg, cfg);
    this._eventHandlers = [];
    this._bindEvents();
  }
  _getDefaultCfg() {
    return {
      startEvent: 'mousedown',
      processEvent: 'mousemove',
      endEvent: 'mouseup',
      resetEvent: 'dblclick'
    };
  }
  _start(ev) {
    this.preStart(ev);
    this.start(ev);
    this.afterStart(ev);
  }

  preStart() {}

  start() {}

  afterStart() {}

  _process(ev) {
    this.preProcess(ev);
    this.process(ev);
    this.afterProcess(ev);
  }

  preProcess() {}

  process() {
  }

  afterProcess() {}

  _end(ev) {
    this.preEnd(ev);
    this.end(ev);
    this.afterEnd(ev);
  }
  preEnd() {}

  end() {}

  afterEnd() {}

  _reset() {
    this.preReset();
    this.reset();
    this.afterReset();
  }

  preReset() {}

  reset() {}

  afterReset() {}

  _bindEvents() {
    _.each(EVENT_TYPES, type => {
      const eventName = this[`${type}Event`];
      const handler = _.wrapBehavior(this, `_${type}`);
      this.layer.on(eventName, handler);
      this._eventHandlers.push({ type: eventName, handler });
    });
  }

  _unbindEvents() {
    const eventHandlers = this._eventHandlers;
    _.each(eventHandlers, eh => {
      this.layer.off(eh.type, eh.handler);
    });
  }

  destory() {
    this._unbindEvents();
    this._reset();
  }
}
