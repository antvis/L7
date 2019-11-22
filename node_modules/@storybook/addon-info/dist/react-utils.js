"use strict";

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = getType;
exports.getDisplayName = getDisplayName;

var _reactIs = require("react-is");

function getType(typeOrMemo) {
  return (0, _reactIs.isMemo)(typeOrMemo) ? typeOrMemo.type : typeOrMemo;
}

function getDisplayName(typeOrMemo) {
  if (typeof typeOrMemo === 'string') {
    return typeOrMemo;
  }

  var type = getType(typeOrMemo);
  return type.displayName || type.name || 'Unknown';
}