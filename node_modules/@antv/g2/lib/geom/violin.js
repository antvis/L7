"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

/**
 * @fileOverview Venn Diagram
 * @author leungwensen@gmail.com
 */
var GeomBase = require('./base');

var Util = require('../util');

var SizeMixin = require('./mixin/size');

require('./shape/violin');

var Violin =
/*#__PURE__*/
function (_GeomBase) {
  (0, _inheritsLoose2.default)(Violin, _GeomBase);
  var _proto = Violin.prototype;

  /**
   * get default configuration
   * @protected
   * @return {Object} configuration
   */
  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);

    cfg.type = 'violin';
    cfg.shapeType = 'violin';
    cfg.generatePoints = true; // super.draw(data, container, shapeFactory, index);

    return cfg;
  };

  function Violin(cfg) {
    var _this;

    _this = _GeomBase.call(this, cfg) || this;
    Util.assign((0, _assertThisInitialized2.default)(_this), SizeMixin);
    return _this;
  }

  _proto.createShapePointsCfg = function createShapePointsCfg(obj) {
    var self = this;

    var cfg = _GeomBase.prototype.createShapePointsCfg.call(this, obj);

    cfg.size = self.getNormalizedSize(obj);
    var sizeField = self.get('_sizeField');
    cfg._size = obj._origin[sizeField];
    return cfg;
  };

  _proto.clearInner = function clearInner() {
    _GeomBase.prototype.clearInner.call(this);

    this.set('defaultSize', null);
  };

  _proto._initAttrs = function _initAttrs() {
    var self = this;
    var attrOptions = self.get('attrOptions');
    var sizeField = attrOptions.size ? attrOptions.size.field : self.get('_sizeField') ? self.get('_sizeField') : 'size';
    self.set('_sizeField', sizeField);
    delete attrOptions.size;

    _GeomBase.prototype._initAttrs.call(this);
  };

  return Violin;
}(GeomBase);

var ViolinDodge =
/*#__PURE__*/
function (_Violin) {
  (0, _inheritsLoose2.default)(ViolinDodge, _Violin);

  function ViolinDodge() {
    return _Violin.apply(this, arguments) || this;
  }

  var _proto2 = ViolinDodge.prototype;

  _proto2.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Violin.prototype.getDefaultCfg.call(this);

    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{
      type: 'dodge'
    }];
    return cfg;
  };

  return ViolinDodge;
}(Violin);

Violin.Dodge = ViolinDodge;
GeomBase.Violin = Violin;
GeomBase.ViolinDodge = ViolinDodge;
module.exports = Violin;