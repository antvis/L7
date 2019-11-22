"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

/**
 * @fileOverview Chart、View、Geometry 的基类
 * @author dxq613@gmail.com
 */
var EventEmitter = require('wolfy87-eventemitter');

var Util = require('./util');

var Base =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inheritsLoose2.default)(Base, _EventEmitter);
  var _proto = Base.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    return {};
  };

  function Base(cfg) {
    var _this;

    _this = _EventEmitter.call(this) || this;
    var attrs = {
      visible: true
    };

    var defaultCfg = _this.getDefaultCfg();

    _this._attrs = attrs;
    Util.assign(attrs, defaultCfg, cfg);
    return _this;
  }

  _proto.get = function get(name) {
    return this._attrs[name];
  };

  _proto.set = function set(name, value) {
    this._attrs[name] = value;
  };

  _proto.show = function show() {
    var visible = this.get('visible');

    if (!visible) {
      this.set('visible', true);
      this.changeVisible(true);
    }
  };

  _proto.hide = function hide() {
    var visible = this.get('visible');

    if (visible) {
      this.set('visible', false);
      this.changeVisible(false);
    }
  }
  /**
   * @protected
   * @param {Boolean} visible 是否可见
   * 显示、隐藏
   */
  ;

  _proto.changeVisible = function changeVisible()
  /* visible */
  {};

  _proto.destroy = function destroy() {
    this._attrs = {};
    this.removeAllListeners();
    this.destroyed = true;
  };

  return Base;
}(EventEmitter);

module.exports = Base;