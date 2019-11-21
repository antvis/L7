'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var style = function style(element, prop) {
  return typeof getComputedStyle !== 'undefined' ? getComputedStyle(element, null).getPropertyValue(prop) : element.style[prop];
};

var overflow = function overflow(element) {
  return style(element, 'overflow') + style(element, 'overflow-y') + style(element, 'overflow-x');
};

var scrollParent = function scrollParent(element) {
  if (!(element instanceof HTMLElement)) {
    return window;
  }

  var parent = element;

  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      break;
    }

    if (!parent.parentNode) {
      break;
    }

    if (/(scroll|auto)/.test(overflow(parent))) {
      return parent;
    }

    parent = parent.parentNode;
  }

  return window;
};

exports.default = scrollParent;