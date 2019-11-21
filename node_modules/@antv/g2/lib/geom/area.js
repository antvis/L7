"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

/**
 * @fileOverview 面积图
 * @author dxq613@gmail.com
 */
var GeomBase = require('./base');

var SplitMixin = require('./mixin/split');

var Util = require('../util');

require('./shape/area');

var Area =
/*#__PURE__*/
function (_GeomBase) {
  (0, _inheritsLoose2.default)(Area, _GeomBase);
  var _proto = Area.prototype;

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);

    cfg.type = 'area';
    cfg.shapeType = 'area';
    cfg.generatePoints = true;
    cfg.sortable = true;
    return cfg;
  };

  function Area(cfg) {
    var _this;

    _this = _GeomBase.call(this, cfg) || this;
    Util.assign((0, _assertThisInitialized2.default)(_this), SplitMixin);
    return _this;
  }

  _proto.draw = function draw(data, container, shapeFactory, index) {
    var self = this;
    var cfg = this.getDrawCfg(data[0]);

    self._applyViewThemeShapeStyle(cfg, cfg.shape, shapeFactory);

    var splitArray = this.splitData(data);
    cfg.origin = data; // path,line,area 等图的origin 是整个序列

    Util.each(splitArray, function (subData, splitedIndex) {
      cfg.splitedIndex = splitedIndex; // 传入分割片段索引 用于生成id

      var points = subData.map(function (obj) {
        return obj.points;
      });
      cfg.points = points;
      var geomShape = shapeFactory.drawShape(cfg.shape, cfg, container);
      self.appendShapeInfo(geomShape, index + splitedIndex);
    });
  };

  return Area;
}(GeomBase);

var AreaStack =
/*#__PURE__*/
function (_Area) {
  (0, _inheritsLoose2.default)(AreaStack, _Area);

  function AreaStack() {
    return _Area.apply(this, arguments) || this;
  }

  var _proto2 = AreaStack.prototype;

  _proto2.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Area.prototype.getDefaultCfg.call(this);

    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{
      type: 'stack'
    }];
    return cfg;
  };

  return AreaStack;
}(Area);

Area.Stack = AreaStack;
GeomBase.Area = Area;
GeomBase.AreaStack = AreaStack;
module.exports = Area;