/* eslint new-cap: [2, {capIsNewExceptions: ["Map"]}] */
import { Map } from 'immutable';

var offset = Map();
var mentionStore = {
  offset: Map(),
  getOffset: function getOffset() {
    return offset;
  },
  getTrigger: function getTrigger(offsetKey) {
    var currentOffset = offset.get(offsetKey);
    return currentOffset && currentOffset.trigger;
  },
  activeSuggestion: function activeSuggestion(_ref) {
    var offsetKey = _ref.offsetKey;

    offset = offset.set(offsetKey, {
      offsetKey: offsetKey
    });
  },
  inActiveSuggestion: function inActiveSuggestion(_ref2) {
    var offsetKey = _ref2.offsetKey;

    offset = offset['delete'](offsetKey);
  },
  updateSuggestion: function updateSuggestion(_ref3) {
    var offsetKey = _ref3.offsetKey,
        position = _ref3.position,
        trigger = _ref3.trigger;

    offset = offset.set(offsetKey, {
      offsetKey: offsetKey,
      position: position,
      trigger: trigger
    });
  }
};

export default mentionStore;