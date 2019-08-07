"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @fileOverview 提取公共代码到util方法
 * @author dxq613@gmail.com
 */
var _default = {
  toTimeStamp: function toTimeStamp(value) {
    if (_util["default"].isString(value)) {
      if (value.indexOf('T') > 0) {
        value = new Date(value).getTime();
      } else {
        value = new Date(value.replace(/-/ig, '/')).getTime();
      }
    }

    if (_util["default"].isDate(value)) {
      value = value.getTime();
    }

    return value;
  }
};
exports["default"] = _default;