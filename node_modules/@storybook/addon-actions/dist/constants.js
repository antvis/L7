"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CYCLIC_KEY = exports.EVENT_ID = exports.PANEL_ID = exports.ADDON_ID = exports.PARAM_KEY = void 0;
var PARAM_KEY = 'actions';
exports.PARAM_KEY = PARAM_KEY;
var ADDON_ID = 'storybook/actions';
exports.ADDON_ID = ADDON_ID;
var PANEL_ID = "".concat(ADDON_ID, "/panel");
exports.PANEL_ID = PANEL_ID;
var EVENT_ID = "".concat(ADDON_ID, "/action-event");
exports.EVENT_ID = EVENT_ID;
var CYCLIC_KEY = '$___storybook.isCyclic';
exports.CYCLIC_KEY = CYCLIC_KEY;