import Interaction from './base';
export default class Select extends Interaction {
  constructor(cfg) {
    super({
      processEvent: 'click',
      ...cfg
    });
  }
  process(ev) {
    this.layer._addActiveFeature(ev);
  }
}
