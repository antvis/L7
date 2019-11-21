"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = booleanSomeValidator;

var _propTypes = require("prop-types");

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function booleanSomeValidator() {
  for (var _len = arguments.length, notAllPropsFalse = new Array(_len), _key = 0; _key < _len; _key++) {
    notAllPropsFalse[_key] = arguments[_key];
  }

  if (notAllPropsFalse.length < 1) {
    throw new TypeError('at least one prop (one of which must be `true`) is required');
  }

  if (!notAllPropsFalse.every(function (x) {
    return typeof x === 'string';
  })) {
    throw new TypeError('all booleanSome props must be strings');
  }

  var propsList = notAllPropsFalse.join(', or ');

  var validator = function booleanSome(props, propName, componentName) {
    var countFalse = function countFalse(count, prop) {
      return count + (props[prop] === false ? 1 : 0);
    };

    var falsePropCount = notAllPropsFalse.reduce(countFalse, 0);

    if (falsePropCount === notAllPropsFalse.length) {
      return new Error("A ".concat(componentName, " must have at least one of these boolean props be `true`: ").concat(propsList));
    }

    for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      rest[_key2 - 3] = arguments[_key2];
    }

    return _propTypes.bool.apply(void 0, [props, propName, componentName].concat(rest));
  };

  validator.isRequired = function booleanSomeRequired(props, propName, componentName) {
    var countFalse = function countFalse(count, prop) {
      return count + (props[prop] === false ? 1 : 0);
    };

    var falsePropCount = notAllPropsFalse.reduce(countFalse, 0);

    if (falsePropCount === notAllPropsFalse.length) {
      return new Error("A ".concat(componentName, " must have at least one of these boolean props be `true`: ").concat(propsList));
    }

    for (var _len3 = arguments.length, rest = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
      rest[_key3 - 3] = arguments[_key3];
    }

    return _propTypes.bool.isRequired.apply(_propTypes.bool, [props, propName, componentName].concat(rest));
  };

  return (0, _wrapValidator["default"])(validator, "booleanSome: ".concat(propsList), notAllPropsFalse);
}
//# sourceMappingURL=booleanSome.js.map