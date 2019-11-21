"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var Util = require('../util');

var Interaction = require('./base');

var getColDef = require('./helper/get-col-def');

var getLimitRange = require('./helper/get-limit-range');

var ZOOMING_TYPES = ['X', 'Y', 'XY'];
var DEFAULT_TYPE = 'X';

var Zoom =
/*#__PURE__*/
function (_Interaction) {
  (0, _inheritsLoose2.default)(Zoom, _Interaction);
  var _proto = Zoom.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Interaction.prototype.getDefaultCfg.call(this);

    return Util.mix({}, cfg, {
      processEvent: 'mousewheel',
      type: DEFAULT_TYPE,
      stepRatio: 0.05,
      stepByField: {},
      minScale: 1,
      maxScale: 4,
      catStep: 2,
      limitRange: {},
      originScaleDefsByField: {}
    });
  };

  function Zoom(cfg, chart) {
    var _this;

    _this = _Interaction.call(this, cfg, chart) || this;
    var me = (0, _assertThisInitialized2.default)(_this);
    me.chart = chart;
    me.type = me.type.toUpperCase();
    var data = me.data = chart.get('data');
    var scales = chart.getYScales();
    var xScale = chart.getXScale();
    scales.push(xScale);
    var scaleController = chart.get('scaleController');
    scales.forEach(function (scale) {
      var field = scale.field;
      var def = scaleController.defs[field] || {};
      me.limitRange[field] = getLimitRange(data, scale);
      me.originScaleDefsByField[field] = Util.mix(def, {
        nice: !!def.nice
      });

      if (scale.isLinear) {
        me.stepByField[field] = (scale.max - scale.min) * me.stepRatio;
      } else {
        me.stepByField[field] = me.catStep;
      }
    });

    if (!ZOOMING_TYPES.includes(me.type)) {
      me.type = DEFAULT_TYPE;
    }

    return _this;
  } // onZoom() { }
  // onZoomin() { }
  // onZoomout() { }


  _proto._applyScale = function _applyScale(scale, delta, minOffset, center) {
    if (minOffset === void 0) {
      minOffset = 0;
    }

    var me = this;
    var chart = me.chart,
        stepByField = me.stepByField;

    if (scale.isLinear) {
      var min = scale.min,
          max = scale.max,
          field = scale.field;
      var maxOffset = 1 - minOffset;
      var step = stepByField[field] * delta;
      var newMin = min + step * minOffset;
      var newMax = max - step * maxOffset;

      if (newMax > newMin) {
        var colDef = getColDef(chart, field); // @2019-02-28 by blue.lb 这里需要将原始scale的配置整合新算出的最大及最小值

        chart.scale(field, Util.mix({}, colDef, {
          nice: false,
          min: newMin,
          max: newMax
        }));
      }
    } else {
      var _field = scale.field,
          values = scale.values;
      var _chart = me.chart;

      var coord = _chart.get('coord');

      var _colDef = getColDef(_chart, _field);

      var originValues = me.limitRange[_field];
      var originValuesLen = originValues.length;
      var maxScale = me.maxScale;
      var minScale = me.minScale;
      var minCount = originValuesLen / maxScale;
      var maxCount = originValuesLen / minScale;
      var valuesLength = values.length;
      var offsetPoint = coord.invertPoint(center);
      var percent = offsetPoint.x;
      var deltaCount = valuesLength - delta * this.catStep;
      var minDelta = parseInt(deltaCount * percent);
      var maxDelta = deltaCount + minDelta;

      if (delta > 0 && valuesLength >= minCount) {
        // zoom out
        var _min = minDelta;
        var _max = maxDelta;

        if (maxDelta > valuesLength) {
          _max = valuesLength - 1;
          _min = valuesLength - deltaCount;
        }

        var newValues = values.slice(_min, _max);

        _chart.scale(_field, Util.mix({}, _colDef, {
          values: newValues
        }));
      } else if (delta < 0 && valuesLength <= maxCount) {
        // zoom in
        var firstIndex = originValues.indexOf(values[0]);
        var lastIndex = originValues.indexOf(values[valuesLength - 1]);
        var minIndex = Math.max(0, firstIndex - minDelta);
        var maxIndex = Math.min(lastIndex + maxDelta, originValuesLen);

        var _newValues = originValues.slice(minIndex, maxIndex);

        _chart.scale(_field, Util.mix({}, _colDef, {
          values: _newValues
        }));
      }
    }
  };

  _proto.process = function process(ev) {
    var me = this;
    var chart = me.chart,
        type = me.type;
    var coord = chart.get('coord');
    var deltaY = ev.deltaY;
    var offsetPoint = coord.invertPoint(ev);

    if (deltaY) {
      me.onZoom && me.onZoom(deltaY, offsetPoint, me);

      if (deltaY > 0) {
        me.onZoomin && me.onZoomin(deltaY, offsetPoint, me);
      } else {
        me.onZoomout && me.onZoomout(deltaY, offsetPoint, me);
      }

      var delta = deltaY / Math.abs(deltaY);

      if (type.indexOf('X') > -1) {
        me._applyScale(chart.getXScale(), delta, offsetPoint.x, ev);
      }

      if (type.indexOf('Y') > -1) {
        var yScales = chart.getYScales();
        yScales.forEach(function (yScale) {
          me._applyScale(yScale, delta, offsetPoint.y, ev);
        });
      }
    }

    chart.repaint();
  };

  _proto.reset = function reset() {
    var me = this;
    var view = me.view,
        originScaleDefsByField = me.originScaleDefsByField;
    var scales = view.getYScales();
    var xScale = view.getXScale();
    scales.push(xScale);
    scales.forEach(function (scale) {
      if (scale.isLinear) {
        var field = scale.field;
        view.scale(field, originScaleDefsByField[field]);
      }
    });
    view.repaint();
  };

  return Zoom;
}(Interaction); // G2.registerInteraction('zoom', Zoom);
// G2.registerInteraction('Zoom', Zoom);


module.exports = Zoom;