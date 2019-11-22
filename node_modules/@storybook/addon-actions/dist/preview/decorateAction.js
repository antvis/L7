"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorate = exports.decorateAction = void 0;

var _action = require("./action");

var _actions = require("./actions");

var _withActions = require("./withActions");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var applyDecorators = function applyDecorators(decorators, actionCallback) {
  return function () {
    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    var decorated = decorators.reduce(function (args, storyFn) {
      return storyFn(args);
    }, _args);
    actionCallback.apply(void 0, _toConsumableArray(decorated));
  };
};

var decorateAction = function decorateAction(decorators) {
  return function (name, options) {
    var callAction = (0, _action.action)(name, options);
    return applyDecorators(decorators, callAction);
  };
};

exports.decorateAction = decorateAction;

var decorate = function decorate(decorators) {
  var decorated = decorateAction(decorators);

  var decoratedActions = function decoratedActions() {
    var rawActions = _actions.actions.apply(void 0, arguments);

    var actionsObject = {};
    Object.keys(rawActions).forEach(function (name) {
      actionsObject[name] = applyDecorators(decorators, rawActions[name]);
    });
    return actionsObject;
  };

  return {
    action: decorated,
    actions: decoratedActions,
    withActions: (0, _withActions.createDecorator)(decoratedActions)
  };
};

exports.decorate = decorate;