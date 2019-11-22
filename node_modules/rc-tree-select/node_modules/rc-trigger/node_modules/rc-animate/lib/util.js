'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportTransition = exports.transitionEndName = exports.animationEndName = undefined;
exports.getStyleProperty = getStyleProperty;
exports.getStyleValue = getStyleValue;
exports.getVendorPrefixes = getVendorPrefixes;
exports.getVendorPrefixedEventName = getVendorPrefixedEventName;
exports.mergeChildren = mergeChildren;
exports.cloneProps = cloneProps;
exports.getTransitionName = getTransitionName;

var _toArray = require('rc-util/lib/Children/toArray');

var _toArray2 = _interopRequireDefault(_toArray);

var _ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// =================== Style ====================
var stylePrefixes = ['-webkit-', '-moz-', '-o-', 'ms-', ''];

function getStyleProperty(node, name) {
  // old ff need null, https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
  var style = window.getComputedStyle(node, null);
  var ret = '';
  for (var i = 0; i < stylePrefixes.length; i++) {
    ret = style.getPropertyValue(stylePrefixes[i] + name);
    if (ret) {
      break;
    }
  }
  return ret;
}

function getStyleValue(node, name) {
  return parseFloat(getStyleProperty(node, name));
}

// ================= Transition =================
// Event wrapper. Copy from react source code
function makePrefixMap(styleProp, eventName) {
  var prefixes = {};

  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes['Webkit' + styleProp] = 'webkit' + eventName;
  prefixes['Moz' + styleProp] = 'moz' + eventName;
  prefixes['ms' + styleProp] = 'MS' + eventName;
  prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();

  return prefixes;
}

function getVendorPrefixes(domSupport, win) {
  var prefixes = {
    animationend: makePrefixMap('Animation', 'AnimationEnd'),
    transitionend: makePrefixMap('Transition', 'TransitionEnd')
  };

  if (domSupport) {
    if (!('AnimationEvent' in win)) {
      delete prefixes.animationend.animation;
    }

    if (!('TransitionEvent' in win)) {
      delete prefixes.transitionend.transition;
    }
  }

  return prefixes;
}

var vendorPrefixes = getVendorPrefixes(_ExecutionEnvironment.canUseDOM, typeof window !== 'undefined' ? window : {});

var style = {};

if (_ExecutionEnvironment.canUseDOM) {
  style = document.createElement('div').style;
}

var prefixedEventNames = {};

function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  }

  var prefixMap = vendorPrefixes[eventName];

  if (prefixMap) {
    var stylePropList = Object.keys(prefixMap);
    var len = stylePropList.length;
    for (var i = 0; i < len; i += 1) {
      var styleProp = stylePropList[i];
      if (Object.prototype.hasOwnProperty.call(prefixMap, styleProp) && styleProp in style) {
        prefixedEventNames[eventName] = prefixMap[styleProp];
        return prefixedEventNames[eventName];
      }
    }
  }

  return '';
}

var animationEndName = exports.animationEndName = getVendorPrefixedEventName('animationend');
var transitionEndName = exports.transitionEndName = getVendorPrefixedEventName('transitionend');
var supportTransition = exports.supportTransition = !!(animationEndName && transitionEndName);

// ==================== Node ====================
/**
 * [Legacy] Find the same children in both prev & next list.
 * Insert not find one before the find one, otherwise in the end. For example:
 * - prev: [1,2,3]
 * - next: [2,4]
 * -> [1,2,4,3]
 */
function mergeChildren(prev, next) {
  var prevList = (0, _toArray2['default'])(prev);
  var nextList = (0, _toArray2['default'])(next);

  // Skip if is single children
  if (prevList.length === 1 && nextList.length === 1 && prevList[0].key === nextList[0].key) {
    return nextList;
  }

  var mergeList = [];
  var nextChildrenMap = {};
  var missMatchChildrenList = [];

  // Fill matched prev node into next node map
  prevList.forEach(function (prevNode) {
    if (prevNode && nextList.some(function (_ref) {
      var key = _ref.key;
      return key === prevNode.key;
    })) {
      if (missMatchChildrenList.length) {
        nextChildrenMap[prevNode.key] = missMatchChildrenList;
        missMatchChildrenList = [];
      }
    } else {
      missMatchChildrenList.push(prevNode);
    }
  });

  // Insert prev node before the matched next node
  nextList.forEach(function (nextNode) {
    if (nextNode && nextChildrenMap[nextNode.key]) {
      mergeList = mergeList.concat(nextChildrenMap[nextNode.key]);
    }
    mergeList.push(nextNode);
  });

  mergeList = mergeList.concat(missMatchChildrenList);

  return mergeList;
}

function cloneProps(props, propList) {
  var newProps = {};
  propList.forEach(function (prop) {
    if (prop in props) {
      newProps[prop] = props[prop];
    }
  });

  return newProps;
}

function getTransitionName(transitionName, transitionType) {
  if (!transitionName) return null;

  if (typeof transitionName === 'object') {
    var type = transitionType.replace(/-\w/g, function (match) {
      return match[1].toUpperCase();
    });
    return transitionName[type];
  }

  return transitionName + '-' + transitionType;
}