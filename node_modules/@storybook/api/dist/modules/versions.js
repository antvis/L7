"use strict";

require("core-js/modules/es.array.find");

require("core-js/modules/es.date.now");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.object.values");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

require("regenerator-runtime/runtime");

var _global = require("global");

var _semver = _interopRequireDefault(require("semver"));

var _clientLogger = require("@storybook/client-logger");

var _version = require("../version");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var checkInterval = 24 * 60 * 60 * 1000;
var versionsUrl = 'https://storybook.js.org/versions.json';

function fetchLatestVersion(_x) {
  return _fetchLatestVersion.apply(this, arguments);
}

function _fetchLatestVersion() {
  _fetchLatestVersion = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(v) {
    var fromFetch;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _global.fetch)("".concat(versionsUrl, "?current=").concat(v));

          case 2:
            fromFetch = _context2.sent;
            return _context2.abrupt("return", fromFetch.json());

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _fetchLatestVersion.apply(this, arguments);
}

function _default(_ref) {
  var store = _ref.store,
      mode = _ref.mode;

  var _store$getState = store.getState(),
      _store$getState$versi = _store$getState.versions,
      persistedVersions = _store$getState$versi === void 0 ? {} : _store$getState$versi,
      _store$getState$lastV = _store$getState.lastVersionCheck,
      lastVersionCheck = _store$getState$lastV === void 0 ? 0 : _store$getState$lastV,
      dismissedVersionNotification = _store$getState.dismissedVersionNotification; // Check to see if we have info about the current version persisted


  var persistedCurrentVersion = Object.values(persistedVersions).find(function (v) {
    return v.version === _version.version;
  });
  var state = {
    versions: Object.assign({}, persistedVersions, {
      current: Object.assign({
        version: _version.version
      }, persistedCurrentVersion && {
        info: persistedCurrentVersion.info
      })
    }),
    lastVersionCheck: lastVersionCheck,
    dismissedVersionNotification: dismissedVersionNotification
  };
  var api = {
    getCurrentVersion: function getCurrentVersion() {
      var _store$getState2 = store.getState(),
          current = _store$getState2.versions.current;

      return current;
    },
    getLatestVersion: function getLatestVersion() {
      var _store$getState3 = store.getState(),
          _store$getState3$vers = _store$getState3.versions,
          latest = _store$getState3$vers.latest,
          next = _store$getState3$vers.next,
          current = _store$getState3$vers.current;

      if (current && _semver["default"].prerelease(current.version) && next) {
        return latest && _semver["default"].gt(latest.version, next.version) ? latest : next;
      }

      return latest;
    },
    versionUpdateAvailable: function versionUpdateAvailable() {
      var latest = api.getLatestVersion();
      var current = api.getCurrentVersion();

      if (!latest || !latest.version) {
        return true;
      }

      return latest && _semver["default"].gt(latest.version, current.version);
    }
  }; // Grab versions from the server/local storage right away

  function init(_x2) {
    return _init.apply(this, arguments);
  }

  function _init() {
    _init = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(_ref2) {
      var fullApi, _store$getState4, _store$getState4$vers, versions, now, _ref3, latest, next, latestVersion;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              fullApi = _ref2.api;
              _store$getState4 = store.getState(), _store$getState4$vers = _store$getState4.versions, versions = _store$getState4$vers === void 0 ? {} : _store$getState4$vers;
              now = Date.now();

              if (!(!lastVersionCheck || now - lastVersionCheck > checkInterval)) {
                _context.next = 17;
                break;
              }

              _context.prev = 4;
              _context.next = 7;
              return fetchLatestVersion(_version.version);

            case 7:
              _ref3 = _context.sent;
              latest = _ref3.latest;
              next = _ref3.next;
              _context.next = 12;
              return store.setState({
                versions: Object.assign({}, versions, {
                  latest: latest,
                  next: next
                }),
                lastVersionCheck: now
              }, {
                persistence: 'permanent'
              });

            case 12:
              _context.next = 17;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](4);

              _clientLogger.logger.warn("Failed to fetch latest version from server: ".concat(_context.t0));

            case 17:
              if (api.versionUpdateAvailable()) {
                latestVersion = api.getLatestVersion().version;

                if (latestVersion !== dismissedVersionNotification && !_semver["default"].patch(latestVersion) && !_semver["default"].prerelease(latestVersion) && mode !== 'production') {
                  fullApi.addNotification({
                    id: 'update',
                    link: '/settings/about',
                    content: "\uD83C\uDF89 Storybook ".concat(latestVersion, " is available!"),
                    onClear: function onClear() {
                      store.setState({
                        dismissedVersionNotification: latestVersion
                      }, {
                        persistence: 'permanent'
                      });
                    }
                  });
                }
              }

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 14]]);
    }));
    return _init.apply(this, arguments);
  }

  return {
    init: init,
    state: state,
    api: api
  };
}