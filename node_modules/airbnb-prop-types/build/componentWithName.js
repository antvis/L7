"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = componentWithName;

var _react = _interopRequireDefault(require("react"));

var _isRegex = _interopRequireDefault(require("is-regex"));

var _arrayPrototype = _interopRequireDefault(require("array.prototype.find"));

var _getComponentName = _interopRequireDefault(require("./helpers/getComponentName"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function stripHOCs(fullName, namesOfHOCsToStrip) {
  var innerName = fullName;

  while (/\([^()]*\)/g.test(innerName)) {
    var HOC = innerName;
    var previousHOC = void 0;

    do {
      previousHOC = HOC;
      HOC = previousHOC.replace(/\([^()]*\)/g, '');
    } while (previousHOC !== HOC);

    if (namesOfHOCsToStrip.indexOf(HOC) === -1) {
      return innerName;
    }

    innerName = innerName.replace(RegExp("^".concat(HOC, "\\(|\\)$"), 'g'), '');
  }

  return innerName;
}

function hasName(name, namesOfHOCsToStrip, propValue, propName, componentName) {
  for (var _len = arguments.length, rest = new Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
    rest[_key - 5] = arguments[_key];
  }

  if (Array.isArray(propValue)) {
    return (0, _arrayPrototype["default"])(propValue.map(function (item) {
      return hasName.apply(void 0, [name, namesOfHOCsToStrip, item, propName, componentName].concat(rest));
    }), Boolean) || null;
  }

  if (!_react["default"].isValidElement(propValue)) {
    return new TypeError("".concat(componentName, ".").concat(propName, " is not a valid React element"));
  }

  var type = propValue.type;
  var componentNameFromType = (0, _getComponentName["default"])(type);
  var innerComponentName = namesOfHOCsToStrip.length > 0 ? stripHOCs(componentNameFromType, namesOfHOCsToStrip) : componentNameFromType;

  if ((0, _isRegex["default"])(name) && !name.test(innerComponentName)) {
    return new TypeError("`".concat(componentName, ".").concat(propName, "` only accepts components matching the regular expression ").concat(name));
  }

  if (!(0, _isRegex["default"])(name) && innerComponentName !== name) {
    return new TypeError("`".concat(componentName, ".").concat(propName, "` only accepts components named ").concat(name, ", got ").concat(innerComponentName));
  }

  return null;
}

function componentWithName(name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof name !== 'string' && !(0, _isRegex["default"])(name)) {
    throw new TypeError('name must be a string or a regex');
  }

  var passedOptions = Object.keys(options);

  if (passedOptions.length > 1 || passedOptions.length === 1 && passedOptions[0] !== 'stripHOCs') {
    throw new TypeError("The only options supported are: \u201CstripHOCs\u201D, got: \u201C".concat(passedOptions.join('”, “'), "\u201D"));
  }

  var _options$stripHOCs = options.stripHOCs,
      namesOfHOCsToStrip = _options$stripHOCs === void 0 ? [] : _options$stripHOCs;
  var allHOCNamesAreValid = namesOfHOCsToStrip.every(function (x) {
    if (typeof x !== 'string' || /[()]/g.test(x)) {
      return false;
    }

    return /^(?:[a-z][a-zA-Z0-9]+|[A-Z][a-z][a-zA-Z0-9]+)$/.test(x);
  });

  if (!allHOCNamesAreValid) {
    throw new TypeError('every provided HOC name must be a string with no parens, and in camelCase');
  }

  function componentWithNameValidator(props, propName, componentName) {
    var propValue = props[propName];

    if (props[propName] == null) {
      return null;
    }

    for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      rest[_key2 - 3] = arguments[_key2];
    }

    return hasName.apply(void 0, [name, namesOfHOCsToStrip, propValue, propName, componentName].concat(rest));
  }

  componentWithNameValidator.isRequired = function componentWithNameRequired(props, propName, componentName) {
    var propValue = props[propName];

    if (propValue == null) {
      return new TypeError("`".concat(componentName, ".").concat(propName, "` requires at least one component named ").concat(name));
    }

    for (var _len3 = arguments.length, rest = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
      rest[_key3 - 3] = arguments[_key3];
    }

    return hasName.apply(void 0, [name, namesOfHOCsToStrip, propValue, propName, componentName].concat(rest));
  };

  return (0, _wrapValidator["default"])(componentWithNameValidator, "componentWithName:".concat(name), name);
}
//# sourceMappingURL=componentWithName.js.map