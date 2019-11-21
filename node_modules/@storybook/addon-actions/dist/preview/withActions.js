"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.match");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withActions = exports.createDecorator = void 0;

var _global = require("global");

var _clientApi = require("@storybook/client-api");

var _actions = require("./actions");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var delegateEventSplitter = /^(\S+)\s*(.*)$/;
var isIE = _global.Element != null && !_global.Element.prototype.matches;
var matchesMethod = isIE ? 'msMatchesSelector' : 'matches';

var root = _global.document && _global.document.getElementById('root');

var hasMatchInAncestry = function hasMatchInAncestry(element, selector) {
  if (element[matchesMethod](selector)) {
    return true;
  }

  var parent = element.parentElement;

  if (!parent) {
    return false;
  }

  return hasMatchInAncestry(parent, selector);
};

var createHandlers = function createHandlers(actionsFn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var actionsObject = actionsFn.apply(void 0, args);
  return Object.entries(actionsObject).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        action = _ref2[1];

    var _key$match = key.match(delegateEventSplitter),
        _key$match2 = _slicedToArray(_key$match, 3),
        _ = _key$match2[0],
        eventName = _key$match2[1],
        selector = _key$match2[2];

    return {
      eventName: eventName,
      handler: function handler(e) {
        if (!selector || hasMatchInAncestry(e.target, selector)) {
          action(e);
        }
      }
    };
  });
};

var createDecorator = function createDecorator(actionsFn) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return function (storyFn) {
      (0, _clientApi.useEffect)(function () {
        if (root != null) {
          var handlers = createHandlers.apply(void 0, [actionsFn].concat(args));
          handlers.forEach(function (_ref3) {
            var eventName = _ref3.eventName,
                handler = _ref3.handler;
            return root.addEventListener(eventName, handler);
          });
          return function () {
            return handlers.forEach(function (_ref4) {
              var eventName = _ref4.eventName,
                  handler = _ref4.handler;
              return root.removeEventListener(eventName, handler);
            });
          };
        }

        return undefined;
      }, [root, actionsFn, args]);
      return storyFn();
    };
  };
};

exports.createDecorator = createDecorator;
var withActions = createDecorator(_actions.actions);
exports.withActions = withActions;