"use strict";

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = void 0;

var _action = require("./action");

var _configureActions = require("./configureActions");

var actions = function actions() {
  var options = _configureActions.config;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var names = args; // last argument can be options

  if (names.length !== 1 && typeof args[args.length - 1] !== 'string') {
    options = Object.assign({}, _configureActions.config, {}, names.pop());
  }

  var namesObject = names[0];

  if (names.length !== 1 || typeof namesObject === 'string') {
    namesObject = {};
    names.forEach(function (name) {
      namesObject[name] = name;
    });
  }

  var actionsObject = {};
  Object.keys(namesObject).forEach(function (name) {
    actionsObject[name] = (0, _action.action)(namesObject[name], options);
  });
  return actionsObject;
};

exports.actions = actions;