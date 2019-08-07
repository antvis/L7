"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadScript;

/*
 * @Author: ThinkGIS
 * @Date: 2018-06-07 14:05:12
 * @Last Modified by: ThinkGIS
 * @Last Modified time: 2018-06-08 10:03:32
 */
function loadScript(src) {
  return new Promise(function (resolve, reject) {
    try {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    } catch (err) {
      reject(err);
    }
  });
}