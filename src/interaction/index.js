import Interaction from './base';
import Active from './active';
import Select from './select';
import Hash from './hash';
import { getInteraction, registerInteraction } from './factory';

registerInteraction('active', Active);
registerInteraction('select', Select);
registerInteraction('hash', Hash);

export { Interaction, registerInteraction, getInteraction };
