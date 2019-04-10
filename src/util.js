import * as Utils from '@antv/util';

const Util = Utils.mix({}, Utils, {
  assign: Utils.mix, // simple mix
  merge: Utils.deepMix, // deep mix
  cloneDeep: Utils.clone,
  isFinite,
  isNaN,
  snapEqual: Utils.isNumberEqual,
  remove: Utils.pull,
  inArray: Utils.contains
});

Util.Array = {
  groupToMap: Utils.groupToMap,
  group: Utils.group,
  merge: Utils.merge,
  values: Utils.valuesOfKey,
  getRange: Utils.getRange,
  firstValue: Utils.firstValue,
  remove: Utils.pull
};

export default Util;
