"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = _interopRequireDefault(require("./common"));

var _dom = _interopRequireDefault(require("./dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Util = {};

_common.default.merge(Util, _common.default, _dom.default, {
  mixin: function mixin(c, mixins) {
    var Param = c.CFG ? 'CFG' : 'ATTRS';

    if (c && mixins) {
      c._mixins = mixins;
      c[Param] = c[Param] || {};
      var temp = {};
      Util.each(mixins, function (mixin) {
        Util.augment(c, mixin);
        var attrs = mixin[Param];

        if (attrs) {
          Util.merge(temp, attrs);
        }
      });
      c[Param] = Util.merge(temp, c[Param]);
    }
  }
});

var _default = Util;
exports.default = _default;