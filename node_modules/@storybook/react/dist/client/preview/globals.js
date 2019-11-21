"use strict";

var _global = require("global");

if (_global.window && _global.window.parent !== _global.window) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    _global.window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = _global.window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  } catch (error) {// The above line can throw if we do not have access to the parent frame -- i.e. cross origin
  }
}

if (_global.window) {
  _global.window.STORYBOOK_ENV = 'react';
}