"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

/**
 * @fileOverview 线图
 * @author dxq613@gmail.com
 */
var GeomBase = require('./base');

var Path = require('./path');

require('./shape/line');

var Line =
/*#__PURE__*/
function (_Path) {
  (0, _inheritsLoose2.default)(Line, _Path);

  function Line() {
    return _Path.apply(this, arguments) || this;
  }

  var _proto = Line.prototype;

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Path.prototype.getDefaultCfg.call(this);

    cfg.type = 'line';
    cfg.sortable = true;
    return cfg;
  };

  return Line;
}(Path);

var LineStack =
/*#__PURE__*/
function (_Line) {
  (0, _inheritsLoose2.default)(LineStack, _Line);

  function LineStack() {
    return _Line.apply(this, arguments) || this;
  }

  var _proto2 = LineStack.prototype;

  _proto2.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Line.prototype.getDefaultCfg.call(this);

    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{
      type: 'stack'
    }];
    return cfg;
  };

  return LineStack;
}(Line);

Line.Stack = LineStack;
GeomBase.Line = Line;
GeomBase.LineStack = LineStack;
module.exports = Line;