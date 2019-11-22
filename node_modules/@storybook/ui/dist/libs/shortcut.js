"use strict";

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.match");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shortcutToHumanString = exports.keyToSymbol = exports.eventMatchesShortcut = exports.shortcutMatchesShortcut = exports.eventToShortcut = exports.isShortcutTaken = exports.optionOrAltSymbol = exports.controlOrMetaKey = exports.controlOrMetaSymbol = exports.isMacLike = void 0;

var _global = require("global");

// The shortcut is our JSON-ifiable representation of a shortcut combination
var isMacLike = function isMacLike() {
  return _global.navigator && _global.navigator.platform ? !!_global.navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) : false;
};

exports.isMacLike = isMacLike;

var controlOrMetaSymbol = function controlOrMetaSymbol() {
  return isMacLike() ? '⌘' : 'ctrl';
};

exports.controlOrMetaSymbol = controlOrMetaSymbol;

var controlOrMetaKey = function controlOrMetaKey() {
  return isMacLike() ? 'meta' : 'control';
};

exports.controlOrMetaKey = controlOrMetaKey;

var optionOrAltSymbol = function optionOrAltSymbol() {
  return isMacLike() ? '⌥' : 'alt';
};

exports.optionOrAltSymbol = optionOrAltSymbol;

var isShortcutTaken = function isShortcutTaken(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}; // Map a keyboard event to a keyboard shortcut
// NOTE: if we change the fields on the event that we need, we'll need to update the serialization in core/preview/start.js


exports.isShortcutTaken = isShortcutTaken;

var eventToShortcut = function eventToShortcut(e) {
  // Meta key only doesn't map to a shortcut
  if (['Meta', 'Alt', 'Control', 'Shift'].includes(e.key)) {
    return null;
  }

  var keys = [];

  if (e.altKey) {
    keys.push('alt');
  }

  if (e.ctrlKey) {
    keys.push('control');
  }

  if (e.metaKey) {
    keys.push('meta');
  }

  if (e.shiftKey) {
    keys.push('shift');
  }

  if (e.key && e.key.length === 1 && e.key !== ' ') {
    keys.push(e.key.toUpperCase());
  }

  if (e.key === ' ') {
    keys.push('space');
  }

  if (e.key === 'Escape') {
    keys.push('escape');
  }

  if (e.key === 'ArrowRight') {
    keys.push('ArrowRight');
  }

  if (e.key === 'ArrowDown') {
    keys.push('ArrowDown');
  }

  if (e.key === 'ArrowUp') {
    keys.push('ArrowUp');
  }

  if (e.key === 'ArrowLeft') {
    keys.push('ArrowLeft');
  }

  return keys.length > 0 ? keys : null;
};

exports.eventToShortcut = eventToShortcut;

var shortcutMatchesShortcut = function shortcutMatchesShortcut(inputShortcut, shortcut) {
  return inputShortcut && inputShortcut.length === shortcut.length && !inputShortcut.find(function (key, i) {
    return key !== shortcut[i];
  });
}; // Should this keyboard event trigger this keyboard shortcut?


exports.shortcutMatchesShortcut = shortcutMatchesShortcut;

var eventMatchesShortcut = function eventMatchesShortcut(e, shortcut) {
  return shortcutMatchesShortcut(eventToShortcut(e), shortcut);
};

exports.eventMatchesShortcut = eventMatchesShortcut;

var keyToSymbol = function keyToSymbol(key) {
  if (key === 'alt') {
    return optionOrAltSymbol();
  }

  if (key === 'control') {
    return '⌃';
  }

  if (key === 'meta') {
    return '⌘';
  }

  if (key === 'shift') {
    return '⇧​';
  }

  if (key === 'Enter' || key === 'Backspace' || key === 'Esc') {
    return '';
  }

  if (key === 'escape') {
    return '';
  }

  if (key === ' ') {
    return 'SPACE';
  }

  if (key === 'ArrowUp') {
    return '↑';
  }

  if (key === 'ArrowDown') {
    return '↓';
  }

  if (key === 'ArrowLeft') {
    return '←';
  }

  if (key === 'ArrowRight') {
    return '→';
  }

  return key.toUpperCase();
}; // Display the shortcut as a human readable string


exports.keyToSymbol = keyToSymbol;

var shortcutToHumanString = function shortcutToHumanString(shortcut) {
  return shortcut.map(keyToSymbol).join(' ');
};

exports.shortcutToHumanString = shortcutToHumanString;