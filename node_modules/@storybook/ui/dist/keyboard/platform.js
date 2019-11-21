"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OS = exports.OperatingSystem = exports.isLinux = exports.isMacintosh = exports.isWindows = exports.Platform = void 0;

var _global = require("global");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _isWindows = false;
var _isMacintosh = false;
var _isLinux = false;

var _locale;

var _language;

var Platform;
exports.Platform = Platform;

(function (Platform) {
  Platform[Platform["Mac"] = 0] = "Mac";
  Platform[Platform["Linux"] = 1] = "Linux";
  Platform[Platform["Windows"] = 2] = "Windows";
})(Platform || (exports.Platform = Platform = {}));

var isWindows = _isWindows;
exports.isWindows = isWindows;
var isMacintosh = _isMacintosh;
exports.isMacintosh = isMacintosh;
var isLinux = _isLinux;
exports.isLinux = isLinux;

if (_typeof(_global.navigator) === 'object') {
  var userAgent = _global.navigator.userAgent;
  _isWindows = userAgent.indexOf('Windows') >= 0;
  _isMacintosh = userAgent.indexOf('Macintosh') >= 0;
  _isLinux = userAgent.indexOf('Linux') >= 0;
  _locale = _global.navigator.language;
  _language = _locale;
}

var OperatingSystem;
exports.OperatingSystem = OperatingSystem;

(function (OperatingSystem) {
  OperatingSystem[OperatingSystem["Windows"] = 1] = "Windows";
  OperatingSystem[OperatingSystem["Macintosh"] = 2] = "Macintosh";
  OperatingSystem[OperatingSystem["Linux"] = 3] = "Linux";
})(OperatingSystem || (exports.OperatingSystem = OperatingSystem = {}));

var OS = _isMacintosh ? OperatingSystem.Macintosh : _isWindows ? OperatingSystem.Windows : OperatingSystem.Linux;
exports.OS = OS;