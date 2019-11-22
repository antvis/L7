"use strict";

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.map");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.createSubscriptionsStore = void 0;

var createSubscriptionsStore = function createSubscriptionsStore() {
  var subscriptions = new Map();
  return {
    register: function register(subscribe) {
      var subscription = subscriptions.get(subscribe);

      if (!subscription) {
        subscription = {
          unsubscribe: subscribe()
        };
        subscriptions.set(subscribe, subscription);
      }

      subscription.used = true;
    },
    markAllAsUnused: function markAllAsUnused() {
      subscriptions.forEach(function (subscription) {
        // eslint-disable-next-line no-param-reassign
        subscription.used = false;
      });
    },
    clearUnused: function clearUnused() {
      subscriptions.forEach(function (subscription, key) {
        if (subscription.used) return;
        subscription.unsubscribe();
        subscriptions["delete"](key);
      });
    }
  };
};

exports.createSubscriptionsStore = createSubscriptionsStore;

var _default = createSubscriptionsStore();

exports["default"] = _default;