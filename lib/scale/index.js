"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("../util"));

var _base = _interopRequireDefault(require("./base"));

var _linear = _interopRequireDefault(require("./linear"));

var _identity = _interopRequireDefault(require("./identity"));

var _category = _interopRequireDefault(require("./category"));

var _time = _interopRequireDefault(require("./time"));

var _timeCat = _interopRequireDefault(require("./time-cat"));

var _log = _interopRequireDefault(require("./log"));

var _pow = _interopRequireDefault(require("./pow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @fileOverview Scale entry, used to reference all the scales
 * @author dxq613@gmail.com
 */
_base["default"].Linear = _linear["default"];
_base["default"].Identity = _identity["default"];
_base["default"].Cat = _category["default"];
_base["default"].Time = _time["default"];
_base["default"].TimeCat = _timeCat["default"];
_base["default"].Log = _log["default"];
_base["default"].Pow = _pow["default"];

var _loop = function _loop(k) {
  if (_base["default"].hasOwnProperty(k)) {
    var methodName = _util["default"].lowerFirst(k);

    _base["default"][methodName] = function (cfg) {
      return new _base["default"][k](cfg);
    };
  }
};

for (var k in _base["default"]) {
  _loop(k);
}

var CAT_ARR = ['cat', 'timeCat'];

_base["default"].isCategory = function (type) {
  return CAT_ARR.indexOf(type) >= 0;
};

var _default = _base["default"];
exports["default"] = _default;