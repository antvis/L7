"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

/**
 * @fileOverview 边，用于关系图的边
 * @author dxq613@gmail.com
 */
var GeomBase = require('./base');

require('./shape/edge');

var Edge =
/*#__PURE__*/
function (_GeomBase) {
  (0, _inheritsLoose2.default)(Edge, _GeomBase);

  function Edge() {
    return _GeomBase.apply(this, arguments) || this;
  }

  var _proto = Edge.prototype;

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);

    cfg.type = 'edge';
    cfg.shapeType = 'edge';
    cfg.generatePoints = true;
    return cfg;
  };

  return Edge;
}(GeomBase);

GeomBase.Edge = Edge;
module.exports = Edge;