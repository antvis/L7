"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

/**
 * @fileOverview 自定义图形
 * @author dxq613@gmail.com
 */
var GeomBase = require('./base');

var Util = require('../util');

var SizeMixin = require('./mixin/size');

require('./shape/schema');

var Schema =
/*#__PURE__*/
function (_GeomBase) {
  (0, _inheritsLoose2.default)(Schema, _GeomBase);
  var _proto = Schema.prototype;

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);

    cfg.type = 'schema';
    cfg.shapeType = 'schema';
    cfg.generatePoints = true;
    return cfg;
  };

  function Schema(cfg) {
    var _this;

    _this = _GeomBase.call(this, cfg) || this;
    Util.assign((0, _assertThisInitialized2.default)(_this), SizeMixin);
    return _this;
  }

  _proto.createShapePointsCfg = function createShapePointsCfg(obj) {
    var cfg = _GeomBase.prototype.createShapePointsCfg.call(this, obj);

    cfg.size = this.getNormalizedSize(obj);
    return cfg;
  };

  _proto.clearInner = function clearInner() {
    _GeomBase.prototype.clearInner.call(this);

    this.set('defaultSize', null);
  };

  return Schema;
}(GeomBase);

var SchemaDodge =
/*#__PURE__*/
function (_Schema) {
  (0, _inheritsLoose2.default)(SchemaDodge, _Schema);

  function SchemaDodge() {
    return _Schema.apply(this, arguments) || this;
  }

  var _proto2 = SchemaDodge.prototype;

  _proto2.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Schema.prototype.getDefaultCfg.call(this);

    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{
      type: 'dodge'
    }];
    return cfg;
  };

  return SchemaDodge;
}(Schema);

Schema.Dodge = SchemaDodge;
GeomBase.Schema = Schema;
GeomBase.SchemaDodge = SchemaDodge;
module.exports = Schema;