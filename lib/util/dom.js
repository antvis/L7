"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TABLE = document.createElement('table');
var TABLE_TR = document.createElement('tr');
var FRAGMENT_REG = /^\s*<(\w+|!)[^>]*>/;
var CONTAINERS = {
  tr: document.createElement('tbody'),
  tbody: TABLE,
  thead: TABLE,
  tfoot: TABLE,
  td: TABLE_TR,
  th: TABLE_TR,
  '*': document.createElement('div')
};
var _default = {
  getBoundingClientRect: function getBoundingClientRect(node, defaultValue) {
    if (node && node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      var top = document.documentElement.clientTop;
      var left = document.documentElement.clientLeft;
      return {
        top: rect.top - top,
        bottom: rect.bottom - top,
        left: rect.left - left,
        right: rect.right - left
      };
    }

    return defaultValue || null;
  },

  /**
   * 获取样式
   * @param  {Object} dom DOM节点
   * @param  {String} name 样式名
   * @param  {Any} defaultValue 默认值
   * @return {String} 属性值
   */
  getStyle: function getStyle(dom, name, defaultValue) {
    try {
      if (window.getComputedStyle) {
        return window.getComputedStyle(dom, null)[name];
      }

      return dom.currentStyle[name];
    } catch (e) {
      if (!_common.default.isNil(defaultValue)) {
        return defaultValue;
      }

      return null;
    }
  },
  modifyCSS: function modifyCSS(dom, css) {
    if (dom) {
      for (var key in css) {
        if (css.hasOwnProperty(key)) {
          dom.style[key] = css[key];
        }
      }
    }

    return dom;
  },

  /**
   * 创建DOM 节点
   * @param  {String} str Dom 字符串
   * @return {HTMLElement}  DOM 节点
   */
  createDom: function createDom(str) {
    var name = FRAGMENT_REG.test(str) && RegExp.$1;

    if (!(name in CONTAINERS)) {
      name = '*';
    }

    var container = CONTAINERS[name];
    str = str.replace(/(^\s*)|(\s*$)/g, '');
    container.innerHTML = '' + str;
    var dom = container.childNodes[0];
    container.removeChild(dom);
    return dom;
  },
  getRatio: function getRatio() {
    return window.devicePixelRatio ? window.devicePixelRatio : 2;
  },

  /**
   * 获取宽度
   * @param  {HTMLElement} el  dom节点
   * @param  {Number} defaultValue 默认值
   * @return {Number} 宽度
   */
  getWidth: function getWidth(el, defaultValue) {
    var width = this.getStyle(el, 'width', defaultValue);

    if (width === 'auto') {
      width = el.offsetWidth;
    }

    return parseFloat(width);
  },

  /**
   * 获取高度
   * @param  {HTMLElement} el dom节点
   * @param  {Number} defaultValue 默认值
   * @return {Number} 高度
   */
  getHeight: function getHeight(el, defaultValue) {
    var height = this.getStyle(el, 'height', defaultValue);

    if (height === 'auto') {
      height = el.offsetHeight;
    }

    return parseFloat(height);
  },

  /**
   * 获取外层高度
   * @param  {HTMLElement} el dom节点
   * @param  {Number} defaultValue 默认值
   * @return {Number} 高度
   */
  getOuterHeight: function getOuterHeight(el, defaultValue) {
    var height = this.getHeight(el, defaultValue);
    var bTop = parseFloat(this.getStyle(el, 'borderTopWidth')) || 0;
    var pTop = parseFloat(this.getStyle(el, 'paddingTop')) || 0;
    var pBottom = parseFloat(this.getStyle(el, 'paddingBottom')) || 0;
    var bBottom = parseFloat(this.getStyle(el, 'borderBottomWidth')) || 0;
    return height + bTop + bBottom + pTop + pBottom;
  },

  /**
   * 获取外层宽度
   * @param  {HTMLElement} el dom节点
   * @param  {Number} defaultValue 默认值
   * @return {Number} 宽度
   */
  getOuterWidth: function getOuterWidth(el, defaultValue) {
    var width = this.getWidth(el, defaultValue);
    var bLeft = parseFloat(this.getStyle(el, 'borderLeftWidth')) || 0;
    var pLeft = parseFloat(this.getStyle(el, 'paddingLeft')) || 0;
    var pRight = parseFloat(this.getStyle(el, 'paddingRight')) || 0;
    var bRight = parseFloat(this.getStyle(el, 'borderRightWidth')) || 0;
    return width + bLeft + bRight + pLeft + pRight;
  },

  /**
   * 添加事件监听器
   * @param  {Object} target DOM对象
   * @param  {String} eventType 事件名
   * @param  {Funtion} callback 回调函数
   * @return {Object} 返回对象
   */
  addEventListener: function addEventListener(target, eventType, callback) {
    if (target) {
      if (target.addEventListener) {
        target.addEventListener(eventType, callback, false);
        return {
          remove: function remove() {
            target.removeEventListener(eventType, callback, false);
          }
        };
      } else if (target.attachEvent) {
        target.attachEvent('on' + eventType, callback);
        return {
          remove: function remove() {
            target.detachEvent('on' + eventType, callback);
          }
        };
      }
    }
  },
  requestAnimationFrame: function requestAnimationFrame(fn) {
    var method = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
      return setTimeout(fn, 16);
    };

    return method(fn);
  }
};
exports.default = _default;