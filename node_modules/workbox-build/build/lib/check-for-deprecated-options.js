"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const ol = require('common-tags').oneLine;

const checkURLCasing = options => {
  const oldToNewOptionNames = {
    dontCacheBustUrlsMatching: 'dontCacheBustURLsMatching',
    ignoreUrlParametersMatching: 'ignoreURLParametersMatching',
    modifyUrlPrefix: 'modifyURLPrefix',
    templatedUrls: 'templatedURLs'
  };
  const warnings = [];

  var _arr = Object.entries(oldToNewOptionNames);

  for (var _i = 0; _i < _arr.length; _i++) {
    const _arr$_i = (0, _slicedToArray2.default)(_arr[_i], 2),
          oldOption = _arr$_i[0],
          newOption = _arr$_i[1];

    if (oldOption in options) {
      warnings.push(ol`The '${oldOption}' option has been renamed to
          '${newOption}'. Please update your config. '${oldOption}' is now
          deprecated and will be removed in a future release of Workbox.`); // Rename the option so the config will be valid.

      options[newOption] = options[oldOption];
      delete options[oldOption];
    }
  }

  return warnings;
};

const checkStrategyClasses = options => {
  const oldToNewOptionValues = {
    cacheFirst: 'CacheFirst',
    cacheOnly: 'CacheOnly',
    networkFirst: 'NetworkFirst',
    networkOnly: 'NetworkOnly',
    staleWhileRevalidate: 'StaleWhileRevalidate'
  };
  const warnings = [];

  if (options.runtimeCaching) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = options.runtimeCaching[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const entry = _step.value;

        if (typeof entry.handler === 'string' && oldToNewOptionValues.hasOwnProperty(entry.handler)) {
          const oldValue = entry.handler;
          const newValue = oldToNewOptionValues[entry.handler];
          warnings.push(ol`Specifying '${oldValue}'' in a
          'runtimeCaching[].handler' option is deprecated. Please update your
          config to use '${newValue}' instead. In v4 Workbox strategies are now
          classes instead of functions.`); // Set the new value so the config will be valid.

          entry.handler = newValue;
        }
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
  }

  return warnings;
};

module.exports = options => {
  return [...checkURLCasing(options), ...checkStrategyClasses(options)];
};