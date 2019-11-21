"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBeforeSelectionText = getBeforeSelectionText;
exports.getLastMeasureIndex = getLastMeasureIndex;
exports.replaceWithMeasure = replaceWithMeasure;
exports.setInputSelection = setInputSelection;
exports.validateSearch = validateSearch;
exports.filterOption = filterOption;
exports.omit = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var omit = function omit(obj) {
  var clone = _objectSpread({}, obj);

  for (var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  keys.forEach(function (key) {
    delete clone[key];
  });
  return clone;
};
/**
 * Cut input selection into 2 part and return text before selection start
 */


exports.omit = omit;

function getBeforeSelectionText(input) {
  var selectionStart = input.selectionStart;
  return input.value.slice(0, selectionStart);
}
/**
 * Find the last match prefix index
 */


function getLastMeasureIndex(text) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var prefixList = Array.isArray(prefix) ? prefix : [prefix];
  return prefixList.reduce(function (lastMatch, prefixStr) {
    var lastIndex = text.lastIndexOf(prefixStr);

    if (lastIndex > lastMatch.location) {
      return {
        location: lastIndex,
        prefix: prefixStr
      };
    }

    return lastMatch;
  }, {
    location: -1,
    prefix: ''
  });
}

function lower(char) {
  return (char || '').toLowerCase();
}

function reduceText(text, targetText, split) {
  var firstChar = text[0];

  if (!firstChar || firstChar === split) {
    return text;
  } // Reuse rest text as it can


  var restText = text;
  var targetTextLen = targetText.length;

  for (var i = 0; i < targetTextLen; i += 1) {
    if (lower(restText[i]) !== lower(targetText[i])) {
      restText = restText.slice(i);
      break;
    } else if (i === targetTextLen - 1) {
      restText = restText.slice(targetTextLen);
    }
  }

  return restText;
}
/**
 * Paint targetText into current text:
 *  text: little@litest
 *  targetText: light
 *  => little @light test
 */


function replaceWithMeasure(text, measureConfig) {
  var measureLocation = measureConfig.measureLocation,
      prefix = measureConfig.prefix,
      targetText = measureConfig.targetText,
      selectionStart = measureConfig.selectionStart,
      split = measureConfig.split; // Before text will append one space if have other text

  var beforeMeasureText = text.slice(0, measureLocation);

  if (beforeMeasureText[beforeMeasureText.length - split.length] === split) {
    beforeMeasureText = beforeMeasureText.slice(0, beforeMeasureText.length - split.length);
  }

  if (beforeMeasureText) {
    beforeMeasureText = "".concat(beforeMeasureText).concat(split);
  } // Cut duplicate string with current targetText


  var restText = reduceText(text.slice(selectionStart), targetText.slice(selectionStart - measureLocation - prefix.length), split);

  if (restText.slice(0, split.length) === split) {
    restText = restText.slice(split.length);
  }

  var connectedStartText = "".concat(beforeMeasureText).concat(prefix).concat(targetText).concat(split);
  return {
    text: "".concat(connectedStartText).concat(restText),
    selectionLocation: connectedStartText.length
  };
}

function setInputSelection(input, location) {
  input.setSelectionRange(location, location);
  /**
   * Reset caret into view.
   * Since this function always called by user control, it's safe to focus element.
   */

  input.blur();
  input.focus();
}

function validateSearch(text, props) {
  var split = props.split;
  return !split || text.indexOf(split) === -1;
}

function filterOption(input, _ref) {
  var _ref$value = _ref.value,
      value = _ref$value === void 0 ? '' : _ref$value;
  var lowerCase = input.toLowerCase();
  return value.toLowerCase().indexOf(lowerCase) !== -1;
}