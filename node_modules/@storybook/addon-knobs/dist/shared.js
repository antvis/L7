"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLICK = exports.SET_OPTIONS = exports.CHANGE = exports.SET = exports.RESET = exports.PANEL_ID = exports.ADDON_ID = exports.PARAM_KEY = void 0;
// addons, panels and events get unique names using a prefix
var PARAM_KEY = 'knobs';
exports.PARAM_KEY = PARAM_KEY;
var ADDON_ID = 'storybookjs/knobs';
exports.ADDON_ID = ADDON_ID;
var PANEL_ID = "".concat(ADDON_ID, "/panel");
exports.PANEL_ID = PANEL_ID;
var RESET = "".concat(ADDON_ID, "/reset");
exports.RESET = RESET;
var SET = "".concat(ADDON_ID, "/set");
exports.SET = SET;
var CHANGE = "".concat(ADDON_ID, "/change");
exports.CHANGE = CHANGE;
var SET_OPTIONS = "".concat(ADDON_ID, "/set-options");
exports.SET_OPTIONS = SET_OPTIONS;
var CLICK = "".concat(ADDON_ID, "/click");
exports.CLICK = CLICK;