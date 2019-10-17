import * as Utils from '@antv/util';

const Util = {
  assign: Utils.mix, // simple mix
  merge: Utils.deepMix, // deep mix
  cloneDeep: Utils.clone,
  isFinite,
  isNaN,
  snapEqual: Utils.isNumberEqual,
  remove: Utils.pull,
  inArray: Utils.contains,
  ...Utils
};

Util.Array = {
  groupToMap: Utils.groupToMap,
  group: Utils.group,
  merge: Util.merge,
  values: Utils.valuesOfKey,
  getRange: Utils.getRange,
  firstValue: Utils.firstValue,
  remove: Utils.pull
};

export default Util;
