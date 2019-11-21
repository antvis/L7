"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _default(_ref) {
  var store = _ref.store;
  var api = {
    addNotification: function addNotification(notification) {
      // Get rid of it if already exists
      api.clearNotification(notification.id);

      var _store$getState = store.getState(),
          notifications = _store$getState.notifications;

      store.setState({
        notifications: [].concat(_toConsumableArray(notifications), [notification])
      });
    },
    clearNotification: function clearNotification(id) {
      var _store$getState2 = store.getState(),
          notifications = _store$getState2.notifications;

      store.setState({
        notifications: notifications.filter(function (n) {
          return n.id !== id;
        })
      });
      var notification = notifications.find(function (n) {
        return n.id === id;
      });

      if (notification && notification.onClear) {
        notification.onClear();
      }
    }
  };
  var state = {
    notifications: []
  };
  return {
    api: api,
    state: state
  };
}