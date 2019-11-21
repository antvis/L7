"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = betweenValidator;

var _object = _interopRequireDefault(require("object.entries"));

var _shape = _interopRequireDefault(require("./shape"));

var _valuesOf = _interopRequireDefault(require("./valuesOf"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function number(props, propName, componentName) {
  var value = props[propName];

  if (typeof value === 'number' && !isNaN(value)) {
    return null;
  }

  return new TypeError("".concat(componentName, ": ").concat(propName, " must be a non-NaN number."));
}

function numberOrPropsFunc(props, propName) {
  var value = props[propName];

  if (typeof value === 'function') {
    return null;
  }

  if (typeof value === 'number' && !isNaN(value)) {
    return null;
  }

  return new TypeError("".concat(propName, ": a function, or a non-NaN number is required"));
}

function lowerCompare(value, _ref) {
  var gt = _ref.gt,
      gte = _ref.gte;

  if (typeof gt === 'number') {
    return value > gt;
  }

  if (typeof gte === 'number') {
    return value >= gte;
  }

  return true;
}

function upperCompare(value, _ref2) {
  var lt = _ref2.lt,
      lte = _ref2.lte;

  if (typeof lt === 'number') {
    return value < lt;
  }

  if (typeof lte === 'number') {
    return value <= lte;
  }

  return true;
}

function greaterThanError(_ref3) {
  var gt = _ref3.gt,
      gte = _ref3.gte;

  if (typeof gt === 'number') {
    return "greater than ".concat(gt);
  }

  if (typeof gte === 'number') {
    return "greater than or equal to ".concat(gte);
  }

  return '';
}

function lessThanError(_ref4) {
  var lt = _ref4.lt,
      lte = _ref4.lte;

  if (typeof lt === 'number') {
    return "less than ".concat(lt);
  }

  if (typeof lte === 'number') {
    return "less than or equal to ".concat(lte);
  }

  return '';
}

function errorMessage(componentName, propName, opts) {
  var errors = [greaterThanError(opts), lessThanError(opts)].filter(Boolean).join(' and ');
  return "".concat(componentName, ": ").concat(propName, " must be ").concat(errors);
}

function propsThunkify(opts) {
  return (0, _object["default"])(opts).reduce(function (acc, _ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        value = _ref6[1];

    var numberThunk = typeof value === 'number' ? function () {
      return value;
    } : value;
    return _objectSpread({}, acc, _defineProperty({}, key, numberThunk));
  }, {});
}

function invokeWithProps(optsThunks, props) {
  return (0, _object["default"])(optsThunks).reduce(function (acc, _ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        key = _ref8[0],
        thunk = _ref8[1];

    var value = thunk(props);
    return _objectSpread({}, acc, _defineProperty({}, key, value));
  }, {});
}

var argValidators = [(0, _shape["default"])({
  lt: numberOrPropsFunc,
  gt: numberOrPropsFunc
}).isRequired, (0, _shape["default"])({
  lte: numberOrPropsFunc,
  gt: numberOrPropsFunc
}).isRequired, (0, _shape["default"])({
  lt: numberOrPropsFunc,
  gte: numberOrPropsFunc
}).isRequired, (0, _shape["default"])({
  lte: numberOrPropsFunc,
  gte: numberOrPropsFunc
}).isRequired, (0, _shape["default"])({
  lt: numberOrPropsFunc
}).isRequired, (0, _shape["default"])({
  lte: numberOrPropsFunc
}).isRequired, (0, _shape["default"])({
  gt: numberOrPropsFunc
}).isRequired, (0, _shape["default"])({
  gte: numberOrPropsFunc
}).isRequired];

function argValidator(props, propName) {
  return argValidators.every(function (validator) {
    return !!validator(props, propName);
  });
}

var thunkValueValidator = (0, _valuesOf["default"])(number).isRequired;

function betweenValidator(options) {
  var argError = argValidator({
    options: options
  }, 'options');

  if (argError) {
    throw new TypeError('between: only one of the pairs of `lt`/`lte`, and `gt`/`gte`, may be supplied, and at least one pair must be provided.');
  }

  var optsThunks = propsThunkify(options);

  var validator = function between(props, propName, componentName) {
    var propValue = props[propName];

    if (propValue == null) {
      return null;
    }

    if (typeof propValue !== 'number') {
      return new RangeError("".concat(componentName, ": ").concat(propName, " must be a number, got \"").concat(_typeof(propValue), "\""));
    }

    var opts = invokeWithProps(optsThunks, props);

    for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    var thunkValuesError = thunkValueValidator.apply(void 0, [_defineProperty({}, propName, opts), propName, componentName].concat(rest));

    if (thunkValuesError) {
      return thunkValuesError;
    }

    if (!lowerCompare(propValue, opts) || !upperCompare(propValue, opts)) {
      return new RangeError(errorMessage(componentName, propName, opts));
    }

    return null;
  };

  validator.isRequired = function betweenRequired(props, propName, componentName) {
    var propValue = props[propName];

    if (typeof propValue !== 'number') {
      return new RangeError("".concat(componentName, ": ").concat(propName, " must be a number, got \"").concat(_typeof(propValue), "\""));
    }

    var opts = invokeWithProps(optsThunks, props);

    for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      rest[_key2 - 3] = arguments[_key2];
    }

    var thunkValuesError = thunkValueValidator.apply(void 0, [_defineProperty({}, propName, opts), propName, componentName].concat(rest));

    if (thunkValuesError) {
      return thunkValuesError;
    }

    if (!lowerCompare(propValue, opts) || !upperCompare(propValue, opts)) {
      return new RangeError(errorMessage(componentName, propName, opts));
    }

    return null;
  };

  return (0, _wrapValidator["default"])(validator, 'between', options);
}
//# sourceMappingURL=between.js.map