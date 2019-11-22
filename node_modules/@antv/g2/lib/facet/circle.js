"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

/**
 * @fileOverview circle facets
 * @author dxq613@gmail.com
 */
var Base = require('./base');

function getPoint(center, r, angle) {
  return {
    x: center.x + r * Math.cos(angle),
    y: center.y + r * Math.sin(angle)
  };
}

var Circle =
/*#__PURE__*/
function (_Base) {
  (0, _inheritsLoose2.default)(Circle, _Base);

  function Circle() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = Circle.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);

    cfg.type = 'circle';
    return cfg;
  };

  _proto.getRegion = function getRegion(count, index) {
    var r = 1 / 2; // 画布半径

    var avgAngle = Math.PI * 2 / count;
    var angle = -1 * Math.PI / 2 + avgAngle * index; // 当前分面所在的弧度

    var facetR = r / (1 + 1 / Math.sin(avgAngle / 2));
    var center = {
      x: 0.5,
      y: 0.5
    }; // 画布圆心

    var middle = getPoint(center, r - facetR, angle); // 分面的中心点

    var startAngle = Math.PI * 5 / 4; // 右上角

    var endAngle = Math.PI * 1 / 4; // 左下角

    return {
      start: getPoint(middle, facetR, startAngle),
      end: getPoint(middle, facetR, endAngle)
    };
  };

  _proto.generateFacets = function generateFacets(data) {
    var self = this;
    var fields = self.fields;
    var field = fields[0];

    if (!field) {
      throw 'Please specify for the field for facet!';
    }

    var values = self.getFieldValues(field, data);
    var count = values.length;
    var rst = [];
    values.forEach(function (value, index) {
      var conditions = [{
        field: field,
        value: value,
        values: values
      }];
      var filter = self.getFilter(conditions);
      var subData = data.filter(filter);
      var facet = {
        type: self.type,
        colValue: value,
        colField: field,
        colIndex: index,
        cols: count,
        rows: 1,
        rowIndex: 0,
        data: subData,
        region: self.getRegion(count, index)
      };
      rst.push(facet);
    });
    return rst;
  };

  return Circle;
}(Base);

module.exports = Circle;