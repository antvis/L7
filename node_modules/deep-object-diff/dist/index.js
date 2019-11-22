(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './diff', './added', './deleted', './updated', './detailed'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./diff'), require('./added'), require('./deleted'), require('./updated'), require('./detailed'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.diff, global.added, global.deleted, global.updated, global.detailed);
    global.index = mod.exports;
  }
})(this, function (exports, _diff, _added, _deleted, _updated, _detailed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.detailedDiff = exports.updatedDiff = exports.deletedDiff = exports.diff = exports.addedDiff = undefined;

  var _diff2 = _interopRequireDefault(_diff);

  var _added2 = _interopRequireDefault(_added);

  var _deleted2 = _interopRequireDefault(_deleted);

  var _updated2 = _interopRequireDefault(_updated);

  var _detailed2 = _interopRequireDefault(_detailed);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.addedDiff = _added2.default;
  exports.diff = _diff2.default;
  exports.deletedDiff = _deleted2.default;
  exports.updatedDiff = _updated2.default;
  exports.detailedDiff = _detailed2.default;
});