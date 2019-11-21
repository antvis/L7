"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.search");

require("core-js/modules/es.string.starts-with");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LocationProvider", {
  enumerable: true,
  get: function get() {
    return _router.LocationProvider;
  }
});
exports.navigate = exports.Route = exports.Location = exports.Match = exports.Link = void 0;

var _global = require("global");

var _react = _interopRequireDefault(require("react"));

var _router = require("@reach/router");

var _visibility = require("./visibility");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var getBase = function getBase() {
  return "".concat(_global.document.location.pathname, "?");
};

var queryNavigate = function queryNavigate(to) {
  (0, _router.navigate)("".concat(getBase(), "path=").concat(to));
}; // A component that will navigate to a new location/path when clicked


exports.navigate = queryNavigate;

var QueryLink = function QueryLink(_ref) {
  var to = _ref.to,
      children = _ref.children,
      rest = _objectWithoutProperties(_ref, ["to", "children"]);

  return _react["default"].createElement(_router.Link, _extends({
    to: "".concat(getBase(), "path=").concat(to)
  }, rest), children);
};

exports.Link = QueryLink;
QueryLink.displayName = "QueryLink";
QueryLink.displayName = 'QueryLink'; // A render-prop component where children is called with a location
// and will be called whenever it changes when it changes

var QueryLocation = function QueryLocation(_ref2) {
  var children = _ref2.children;
  return _react["default"].createElement(_router.Location, null, function (_ref3) {
    var location = _ref3.location;

    var _queryFromString = (0, _utils.queryFromString)(location.search),
        path = _queryFromString.path;

    var _parsePath = (0, _utils.parsePath)(path),
        viewMode = _parsePath.viewMode,
        storyId = _parsePath.storyId;

    return children({
      path: path,
      location: location,
      navigate: queryNavigate,
      viewMode: viewMode,
      storyId: storyId
    });
  });
};

exports.Location = QueryLocation;
QueryLocation.displayName = "QueryLocation";
QueryLocation.displayName = 'QueryLocation'; // A render-prop component for rendering when a certain path is hit.
// It's immensly similar to `Location` but it receives an addition data property: `match`.
// match has a truethy value when the path is hit.

var QueryMatch = function QueryMatch(_ref4) {
  var children = _ref4.children,
      targetPath = _ref4.path,
      _ref4$startsWith = _ref4.startsWith,
      startsWith = _ref4$startsWith === void 0 ? false : _ref4$startsWith;
  return _react["default"].createElement(QueryLocation, null, function (_ref5) {
    var urlPath = _ref5.path,
        rest = _objectWithoutProperties(_ref5, ["path"]);

    return children(Object.assign({
      match: (0, _utils.getMatch)(urlPath, targetPath, startsWith)
    }, rest));
  });
};

exports.Match = QueryMatch;
QueryMatch.displayName = "QueryMatch";
QueryMatch.displayName = 'QueryMatch'; // A component to conditionally render children based on matching a target path

var Route = function Route(_ref6) {
  var path = _ref6.path,
      children = _ref6.children,
      _ref6$startsWith = _ref6.startsWith,
      startsWith = _ref6$startsWith === void 0 ? false : _ref6$startsWith,
      _ref6$hideOnly = _ref6.hideOnly,
      hideOnly = _ref6$hideOnly === void 0 ? false : _ref6$hideOnly;
  return _react["default"].createElement(QueryMatch, {
    path: path,
    startsWith: startsWith
  }, function (_ref7) {
    var match = _ref7.match;

    if (hideOnly) {
      return _react["default"].createElement(_visibility.ToggleVisibility, {
        hidden: !match
      }, children);
    }

    return match ? children : null;
  });
};

exports.Route = Route;
Route.displayName = "Route";
Route.displayName = 'Route';