"use strict";

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const crypto = require('crypto');

module.exports = (compositeURL, dependencyDetails) => {
  let totalSize = 0;
  let compositeHash = '';
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = dependencyDetails[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let fileDetails = _step.value;
      totalSize += fileDetails.size;
      compositeHash += fileDetails.hash;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  const md5 = crypto.createHash('md5');
  md5.update(compositeHash);
  const hashOfHashes = md5.digest('hex');
  return {
    file: compositeURL,
    hash: hashOfHashes,
    size: totalSize
  };
};