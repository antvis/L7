"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVideo = exports.getImage = exports.getArrayBuffer = exports.getJSON = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AJAXError =
/*#__PURE__*/
function (_Error) {
  _inherits(AJAXError, _Error);

  function AJAXError(message, status, url) {
    var _this;

    _classCallCheck(this, AJAXError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AJAXError).call(this, message));
    _this.status = status;
    _this.url = url; // work around for https://github.com/Rich-Harris/buble/issues/40

    _this.name = _this.constructor.name;
    _this.message = message;
    return _this;
  }

  _createClass(AJAXError, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.name, ": ").concat(this.message, " (").concat(this.status, "): ").concat(this.url);
    }
  }]);

  return AJAXError;
}(_wrapNativeSuper(Error));

function makeRequest(requestParameters) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', requestParameters.url, true);

  for (var k in requestParameters.headers) {
    xhr.setRequestHeader(k, requestParameters.headers[k]);
  }

  xhr.withCredentials = requestParameters.credentials === 'include';
  return xhr;
}

var getJSON = function getJSON(requestParameters, callback) {
  var xhr = makeRequest(requestParameters);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onerror = function () {
    callback(new Error(xhr.statusText));
  };

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
      var data;

      try {
        data = JSON.parse(xhr.response);
      } catch (err) {
        return callback(err);
      }

      callback(null, data);
    } else {
      if (xhr.status === 401) {
        callback(new AJAXError("".concat(xhr.statusText), xhr.status, requestParameters.url));
      } else {
        callback(new AJAXError(xhr.statusText, xhr.status, requestParameters.url));
      }
    }
  };

  xhr.send();
  return xhr;
};

exports.getJSON = getJSON;

var getArrayBuffer = function getArrayBuffer(requestParameters, callback) {
  var xhr = makeRequest(requestParameters);
  xhr.responseType = 'arraybuffer';

  xhr.onerror = function () {
    callback(new Error(xhr.statusText));
  };

  xhr.onload = function () {
    var response = xhr.response;

    if (response.byteLength === 0 && xhr.status === 200) {
      return callback(new Error('http status 200 returned without content.'));
    }

    if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
      callback(null, {
        data: response,
        cacheControl: xhr.getResponseHeader('Cache-Control'),
        expires: xhr.getResponseHeader('Expires')
      });
    } else {
      callback(new AJAXError(xhr.statusText, xhr.status, requestParameters.url));
    }
  };

  xhr.send();
  return xhr;
};

exports.getArrayBuffer = getArrayBuffer;

function sameOrigin(url) {
  var a = window.document.createElement('a');
  a.href = url;
  return a.protocol === window.document.location.protocol && a.host === window.document.location.host;
}

var transparentPngUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';

var getImage = function getImage(requestParameters, callback) {
  // request the image with XHR to work around caching issues
  // see https://github.com/mapbox/mapbox-gl-js/issues/1470
  return getArrayBuffer(requestParameters, function (err, imgData) {
    if (err) {
      callback(err);
    } else if (imgData) {
      var img = new window.Image();
      var URL = window.URL || window.webkitURL;

      img.onload = function () {
        callback(null, img);
        URL.revokeObjectURL(img.src);
      };

      var blob = new window.Blob([new Uint8Array(imgData.data)], {
        type: 'image/png'
      });
      img.cacheControl = imgData.cacheControl;
      img.expires = imgData.expires;
      img.src = imgData.data.byteLength ? URL.createObjectURL(blob) : transparentPngUrl;
    }
  });
};

exports.getImage = getImage;

var getVideo = function getVideo(urls, callback) {
  var video = window.document.createElement('video');

  video.onloadstart = function () {
    callback(null, video);
  };

  for (var i = 0; i < urls.length; i++) {
    var s = window.document.createElement('source');

    if (!sameOrigin(urls[i])) {
      video.crossOrigin = 'Anonymous';
    }

    s.src = urls[i];
    video.appendChild(s);
  }

  return video;
};

exports.getVideo = getVideo;