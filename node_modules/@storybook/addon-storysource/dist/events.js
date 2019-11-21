"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENT_ID = exports.PANEL_ID = exports.ADDON_ID = void 0;
var ADDON_ID = 'storybook/source-loader';
exports.ADDON_ID = ADDON_ID;
var PANEL_ID = "".concat(ADDON_ID, "/panel");
exports.PANEL_ID = PANEL_ID;
var EVENT_ID = "".concat(ADDON_ID, "/set");
exports.EVENT_ID = EVENT_ID;