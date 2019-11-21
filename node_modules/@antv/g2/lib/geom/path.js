"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

/**
 * @fileOverview 路径图，无序的线图
 * @author dxq613@gmail.com
 */
var GeomBase = require('./base');

var SplitMixin = require('./mixin/split');

var Util = require('../util');

var Path =
/*#__PURE__*/
function (_GeomBase) {
  (0, _inheritsLoose2.default)(Path, _GeomBase);
  var _proto = Path.prototype;

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);

    cfg.type = 'path';
    cfg.shapeType = 'line';
    return cfg;
  };

  function Path(cfg) {
    var _this;

    _this = _GeomBase.call(this, cfg) || this;
    Util.assign((0, _assertThisInitialized2.default)(_this), SplitMixin);
    return _this;
  }

  _proto.getDrawCfg = function getDrawCfg(obj) {
    var cfg = _GeomBase.prototype.getDrawCfg.call(this, obj);

    cfg.isStack = this.hasStack();
    return cfg;
  };

  _proto.draw = function draw(data, container, shapeFactory, index) {
    var self = this;
    var splitArray = this.splitData(data);
    var cfg = this.getDrawCfg(data[0]);

    self._applyViewThemeShapeStyle(cfg, cfg.shape, shapeFactory);

    cfg.origin = data; // path,line 等图的origin 是整个序列

    Util.each(splitArray, function (subData, splitedIndex) {
      if (!Util.isEmpty(subData)) {
        cfg.splitedIndex = splitedIndex; // 传入分割片段索引 用于生成id

        cfg.points = subData;
        var geomShape = shapeFactory.drawShape(cfg.shape, cfg, container);
        self.appendShapeInfo(geomShape, index + splitedIndex);
      }
    });
  };

  return Path;
}(GeomBase);

GeomBase.Path = Path;
module.exports = Path;