"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isPlainObject = _interopRequireDefault(require("./helpers/isPlainObject"));

var _typeOf = _interopRequireDefault(require("./helpers/typeOf"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
  code adapted from https://github.com/facebook/react/blob/14156e56b9cf18ac86963185c5af4abddf3ff811/src/isomorphic/classic/types/ReactPropTypes.js#L202-L206
  so that it can be called outside of React's normal PropType flow
*/
var ReactPropTypeLocationNames = {
  prop: 'prop',
  context: 'context',
  childContext: 'child context'
};

function object(props, propName, componentName, location, propFullName) {
  var propValue = props[propName];

  if (propValue == null) {
    return null;
  }

  if ((0, _isPlainObject["default"])(propValue)) {
    return null;
  }

  var locationName = ReactPropTypeLocationNames[location] || location;
  return new TypeError("Invalid ".concat(locationName, " `").concat(propFullName, "` of type `").concat((0, _typeOf["default"])(propValue), "` supplied to `").concat(componentName, "`, expected `object`."));
}

object.isRequired = function objectRequired(props, propName, componentName, location, propFullName) {
  var propValue = props[propName];

  if (propValue == null) {
    var locationName = ReactPropTypeLocationNames[location] || location;
    return new TypeError("The ".concat(locationName, " `").concat(propFullName, "` is marked as required in `").concat(componentName, "`, but its value is `").concat(propValue, "`."));
  }

  for (var _len = arguments.length, rest = new Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
    rest[_key - 5] = arguments[_key];
  }

  return object.apply(void 0, [props, propName, componentName, location, propFullName].concat(rest));
};

var _default = function _default() {
  return (0, _wrapValidator["default"])(object, 'object');
};

exports["default"] = _default;
//# sourceMappingURL=object.js.map