(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../added', '../deleted', '../updated'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../added'), require('../deleted'), require('../updated'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.added, global.deleted, global.updated);
    global.index = mod.exports;
  }
})(this, function (module, exports, _added, _deleted, _updated) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _added2 = _interopRequireDefault(_added);

  var _deleted2 = _interopRequireDefault(_deleted);

  var _updated2 = _interopRequireDefault(_updated);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var detailedDiff = function detailedDiff(lhs, rhs) {
    return {
      added: (0, _added2.default)(lhs, rhs),
      deleted: (0, _deleted2.default)(lhs, rhs),
      updated: (0, _updated2.default)(lhs, rhs)
    };
  };

  exports.default = detailedDiff;
  module.exports = exports['default'];
});