'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.classNames = classNames;
function classNames(classSet) {
  return Object.keys(classSet).filter(function (key) {
    return classSet[key];
  }).join(' ');
}