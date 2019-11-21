"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureActions = exports.config = void 0;
var config = {
  depth: 10,
  clearOnStoryChange: true,
  limit: 50
};
exports.config = config;

var configureActions = function configureActions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  Object.assign(config, options);
};

exports.configureActions = configureActions;