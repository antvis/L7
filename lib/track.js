"use strict";

var _global = _interopRequireDefault(require("./global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileOverview track g2
 * @author dxq613@gmail.com
 */
var SERVER_URL = 'https://kcart.alipay.com/web/bi.do'; // 延迟发送请求

setTimeout(function () {
  if (_global.default.trackable) {
    var image = new Image();
    var newObj = {
      pg: document.URL,
      r: new Date().getTime(),
      l7: true,
      version: _global.default.version,
      page_type: 'syslog'
    };
    var d = encodeURIComponent(JSON.stringify([newObj]));
    image.src = "".concat(SERVER_URL, "?BIProfile=merge&d=").concat(d);
  }
}, 3000);