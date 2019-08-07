"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @fileOverview 计算分类的的坐标点
 * @author dxq613@gmail.com
 */
var MAX_COUNT = 8;
var SUB_COUNT = 4; // 控制个数不能过小

function getSimpleArray(data) {
  var arr = [];

  _util["default"].each(data, function (sub) {
    if (_util["default"].isArray(sub)) {
      arr = arr.concat(sub);
    } else {
      arr.push(sub);
    }
  });

  return arr;
}

function getGreatestFactor(count, number) {
  var i;

  for (i = number; i > 0; i--) {
    if (count % i === 0) {
      break;
    }
  } // 如果是素数，没有可以整除的数字


  if (i === 1) {
    for (i = number; i > 0; i--) {
      if ((count - 1) % i === 0) {
        break;
      }
    }
  }

  return i;
}

function _default(info) {
  var rst = {};
  var ticks = [];
  var maxCount = info.maxCount || MAX_COUNT;
  var categories = getSimpleArray(info.data);
  var length = categories.length;
  var tickCount = getGreatestFactor(length - 1, maxCount - 1) + 1; // 如果计算出来只有两个坐标点，则直接使用传入的 maxCount

  if (tickCount === 2) {
    tickCount = maxCount;
  } else if (tickCount < maxCount - SUB_COUNT) {
    tickCount = maxCount - SUB_COUNT;
  }

  var step = parseInt(length / (tickCount - 1), 10);
  var groups = categories.map(function (e, i) {
    return i % step === 0 ? categories.slice(i, i + step) : null;
  }).filter(function (e) {
    return e;
  });

  if (categories.length) {
    ticks.push(categories[0]);
  }

  for (var i = 1; i < groups.length && i * step < length - step; i++) {
    ticks.push(groups[i][0]);
  }

  if (categories.length) {
    var last = categories[length - 1];

    if (ticks.indexOf(last) === -1) {
      ticks.push(last);
    }
  }

  rst.categories = categories;
  rst.ticks = ticks;
  return rst;
}