"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = diff;

var _ = _interopRequireWildcard(require("@antv/util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function diff(a, b) {
  // Throw is a or b are not objects.
  if (!_.isPlainObject(a)) {
    throw new Error('First parameter to diff() is not an object');
  }

  if (!_.isPlainObject(b)) {
    throw new Error('Second parameter to diff() is not an object');
  }

  var changes = [];

  var keysA = _.keys(a);

  var keysB = _.keys(b); // Find the items in A that are not in B.


  _.each(_.difference(keysA, keysB), function (key) {
    changes.push({
      type: 'remove',
      key: key,
      value: a[key]
    });
  }); // Find the items in B that are not in A.


  _.each(_.difference(keysB, keysA), function (key) {
    changes.push({
      type: 'add',
      key: key,
      value: b[key]
    });
  }); // Find the items that are in both, but have changed.


  _.each(intersection(keysA, keysB), function (key) {
    if (!_.isEqual(a[key], b[key])) {
      changes.push({
        type: 'update',
        key: key,
        value: b[key]
      });
    }
  });

  return changes;
}

function intersection(keysA, keysB) {
  return keysA.filter(function (key) {
    return keysB.indexOf(key) > -1;
  });
}