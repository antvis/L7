"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.search");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryParam = exports.getQueryParams = void 0;

var _global = require("global");

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getQueryParams = function getQueryParams() {
  // document.location is not defined in react-native
  if (_global.document && _global.document.location && _global.document.location.search) {
    return _qs["default"].parse(_global.document.location.search, {
      ignoreQueryPrefix: true
    });
  }

  return {};
};

exports.getQueryParams = getQueryParams;

var getQueryParam = function getQueryParam(key) {
  var params = getQueryParams();
  return params[key];
};

exports.getQueryParam = getQueryParam;