"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerInteraction = exports.getInteraction = exports.INTERACTION_MAP = void 0;
var INTERACTION_MAP = {};
exports.INTERACTION_MAP = INTERACTION_MAP;

var getInteraction = function getInteraction(type) {
  return INTERACTION_MAP[type];
};

exports.getInteraction = getInteraction;

var registerInteraction = function registerInteraction(type, ctor) {
  // 注册的时候，需要校验 type 重名，不区分大小写
  if (getInteraction(type)) {
    throw new Error("Interaction type '".concat(type, "' existed."));
  } // 存储到 map 中


  INTERACTION_MAP[type] = ctor;
};

exports.registerInteraction = registerInteraction;