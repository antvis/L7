"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

/**
 * @fileOverview Use matrices to compare different fields
 * @author dxq613@gmail.com
 */
var Rect = require('./rect');

var Matrix =
/*#__PURE__*/
function (_Rect) {
  (0, _inheritsLoose2.default)(Matrix, _Rect);

  function Matrix() {
    return _Rect.apply(this, arguments) || this;
  }

  var _proto = Matrix.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Rect.prototype.getDefaultCfg.call(this);

    cfg.type = 'matrix';
    cfg.showTitle = false;
    return cfg;
  };

  _proto.generateFacets = function generateFacets(data) {
    var self = this;
    var fields = self.fields;
    var rows = fields.length;
    var cols = rows; // 矩阵中行列相等，等于指定的字段个数

    var rst = [];

    for (var i = 0; i < cols; i++) {
      var colField = fields[i];

      for (var j = 0; j < rows; j++) {
        var rowField = fields[j];
        var facet = {
          type: self.type,
          colValue: colField,
          rowValue: rowField,
          colField: colField,
          rowField: rowField,
          colIndex: i,
          rowIndex: j,
          cols: cols,
          rows: rows,
          data: data,
          region: self.getRegion(rows, cols, i, j)
        };
        rst.push(facet);
      }
    }

    return rst;
  } // 设置 x 坐标轴的文本、title 是否显示
  ;

  _proto.setXAxis = function setXAxis(xField, axes, facet) {
    if (facet.rowIndex !== facet.rows - 1) {
      axes[xField].title = null;
      axes[xField].label = null;
    }
  } // 设置 y 坐标轴的文本、title 是否显示
  ;

  _proto.setYAxis = function setYAxis(yField, axes, facet) {
    if (facet.colIndex !== 0) {
      axes[yField].title = null;
      axes[yField].label = null;
    }
  };

  return Matrix;
}(Rect);

module.exports = Matrix;