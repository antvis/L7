"use strict";

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.object.define-property");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mergeWith = _interopRequireDefault(require("lodash/mergeWith"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _clientLogger = require("@storybook/client-logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(a, b) {
  return (0, _mergeWith["default"])({}, a, b, function (objValue, srcValue) {
    if (Array.isArray(srcValue) && Array.isArray(objValue)) {
      srcValue.forEach(function (s) {
        var existing = objValue.find(function (o) {
          return o === s || (0, _isEqual["default"])(o, s);
        });

        if (!existing) {
          objValue.push(s);
        }
      });
      return objValue;
    }

    if (Array.isArray(objValue)) {
      _clientLogger.logger.log(['the types mismatch, picking', objValue]);

      return objValue;
    }

    return undefined;
  });
};

exports["default"] = _default;