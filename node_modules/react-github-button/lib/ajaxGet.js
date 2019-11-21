'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ajaxGet;
function ajaxGet(url, callback) {
  if (typeof XDomainRequest !== 'undefined') {
    callback(null);
    return null;
  }

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
  return xhr;
}
module.exports = exports['default'];