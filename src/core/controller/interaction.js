import Util from '../../util';
import { getInteraction } from '../../interaction/index';
export default class InteractionController {
  constructor(cfg) {
    // defs 列定义
    Util.assign(this, cfg);
  }
  // interaction 方法
  clearAllInteractions() {
    const interactions = this.layer.get('interactions');
    Util.each(interactions, (interaction, key) => {
      interaction.destory();
      delete interactions[key];
    });
    return this;
  }
  clearInteraction(type) {
    const interactions = this.layer.get('interactions');
    if (interactions[type]) {
      interactions[type].destory();
      delete interactions[type];
    }
    return this;
  }
  addInteraction(type, cfg = {}) {
    cfg.layer = this.layer;
    const Ctor = getInteraction(type);
    const interaction = new Ctor(cfg);
    this._setInteraction(type, interaction);
    return this;
  }
  _setInteraction(type, interaction) {
    const interactions = this.layer.get('interactions');
    if (interactions[type]) {
      interactions[type].destory();
    }
    interactions[type] = interaction;
  }
}
