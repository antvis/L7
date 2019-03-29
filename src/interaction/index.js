import Interaction from './base';
import Active from './active';
import Select from './select';
import { getInteraction, registerInteraction } from './factory';

registerInteraction('active', Active);
registerInteraction('select', Select);

export { Interaction, registerInteraction, getInteraction };
