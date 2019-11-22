"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = or;

var _propTypes = require("prop-types");

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function oneOfTypeValidator(validators) {
  var validator = function oneOfType(props, propName, componentName) {
    for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    var propValue = props[propName];

    if (typeof propValue === 'undefined') {
      return null;
    }

    var errors = validators.map(function (v) {
      return v.apply(void 0, [props, propName, componentName].concat(rest));
    }).filter(Boolean);

    if (errors.length < validators.length) {
      return null;
    }

    return new TypeError("".concat(componentName, ": invalid value supplied to ").concat(propName, "."));
  };

  validator.isRequired = function oneOfTypeRequired(props, propName, componentName) {
    for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      rest[_key2 - 3] = arguments[_key2];
    }

    var propValue = props[propName];

    if (typeof propValue === 'undefined') {
      return new TypeError("".concat(componentName, ": missing value for required ").concat(propName, "."));
    }

    var errors = validators.map(function (v) {
      return v.apply(void 0, [props, propName, componentName].concat(rest));
    }).filter(Boolean);

    if (errors.length === validators.length) {
      return new TypeError("".concat(componentName, ": invalid value ").concat(errors, " supplied to required ").concat(propName, "."));
    }

    return null;
  };

  return (0, _wrapValidator["default"])(validator, 'oneOfType', validators);
}

function or(validators) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'or';

  if (!Array.isArray(validators)) {
    throw new TypeError('or: 2 or more validators are required');
  }

  if (validators.length <= 1) {
    throw new RangeError('or: 2 or more validators are required');
  }

  var validator = oneOfTypeValidator([(0, _propTypes.arrayOf)(oneOfTypeValidator(validators))].concat(_toConsumableArray(validators)));
  return (0, _wrapValidator["default"])(validator, name, validators);
}
//# sourceMappingURL=or.js.map