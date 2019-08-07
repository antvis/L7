"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = throttle;

function throttle(fn, time) {
  var pending = false;
  var timerId;

  var later = function later() {
    timerId = null;

    if (pending) {
      fn();
      timerId = setTimeout(later, time);
      pending = false;
    }
  };

  return function () {
    pending = true;

    if (!timerId) {
      later();
    }

    return timerId;
  };
}