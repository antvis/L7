"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = sequenceOfValidator;

var _propTypes = require("prop-types");

var _and = _interopRequireDefault(require("./and"));

var _between = _interopRequireDefault(require("./between"));

var _nonNegativeInteger = _interopRequireDefault(require("./nonNegativeInteger"));

var _object = _interopRequireDefault(require("./object"));

var _withShape = _interopRequireDefault(require("./withShape"));

var _typeOf = _interopRequireDefault(require("./helpers/typeOf"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var minValidator = _nonNegativeInteger["default"];
var maxValidator = (0, _and["default"])([_nonNegativeInteger["default"], (0, _between["default"])({
  gte: 1
})]);

function validateRange(min, max) {
  if (typeof max !== 'number' || typeof min !== 'number') {
    return null; // no additional checking needed unless both are present
  }

  if (min <= max) {
    return null;
  }

  return new RangeError('min must be less than or equal to max');
}

var specifierShape = {
  validator: function validator(props, propName) {
    var propValue = props[propName];

    if (typeof propValue !== 'function') {
      return new TypeError('"validator" must be a propType validator function');
    }

    return null;
  },
  min: function min(props, propName) {
    return minValidator(props, propName) || validateRange(props.min, props.max);
  },
  max: function max(props, propName) {
    return maxValidator(props, propName) || validateRange(props.min, props.max);
  }
};

function getMinMax(_ref) {
  var min = _ref.min,
      max = _ref.max;
  var minimum;
  var maximum;

  if (typeof min !== 'number' && typeof max !== 'number') {
    // neither provided, default to "1"
    minimum = 1;
    maximum = 1;
  } else {
    minimum = typeof min === 'number' ? min : 1;
    maximum = typeof max === 'number' ? max : Infinity;
  }

  return {
    minimum: minimum,
    maximum: maximum
  };
}

function chunkByType(items) {
  var chunk = [];
  var lastType;
  return items.reduce(function (chunks, item) {
    var itemType = (0, _typeOf["default"])(item);

    if (!lastType || itemType === lastType) {
      chunk.push(item);
    } else {
      chunks.push(chunk);
      chunk = [item];
    }

    lastType = itemType;
    return chunks;
  }, []).concat(chunk.length > 0 ? [chunk] : []);
}

function validateChunks(specifiers, props, propName, componentName) {
  var items = props[propName];
  var chunks = chunkByType(items);

  for (var _len = arguments.length, rest = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
    rest[_key - 4] = arguments[_key];
  }

  for (var i = 0; i < specifiers.length; i += 1) {
    var _specifiers$i = specifiers[i],
        validator = _specifiers$i.validator,
        min = _specifiers$i.min,
        max = _specifiers$i.max;

    var _getMinMax = getMinMax({
      min: min,
      max: max
    }),
        minimum = _getMinMax.minimum,
        maximum = _getMinMax.maximum;

    if (chunks.length === 0 && minimum === 0) {
      // no chunks left, but this specifier does not require any items
      continue; // eslint-disable-line no-continue
    }

    var arrayOfValidator = (0, _propTypes.arrayOf)(validator).isRequired;
    var chunk = chunks.shift(); // extract the next chunk to test

    var chunkError = arrayOfValidator.apply(void 0, [_objectSpread({}, props, _defineProperty({}, propName, chunk)), propName, componentName].concat(rest));

    if (chunkError) {
      // this chunk is invalid
      if (minimum === 0) {
        // but, specifier has a min of 0 and can be skipped
        chunks.unshift(chunk); // put the chunk back, for the next iteration

        continue; // eslint-disable-line no-continue
      }

      return chunkError;
    } // chunk is valid!


    if (chunk.length < minimum) {
      return new RangeError("".concat(componentName, ": specifier index ").concat(i, " requires a minimum of ").concat(min, " items, but only has ").concat(chunk.length, "."));
    }

    if (chunk.length > maximum) {
      return new RangeError("".concat(componentName, ": specifier index ").concat(i, " requires a maximum of ").concat(max, " items, but has ").concat(chunk.length, "."));
    }
  }

  if (chunks.length > 0) {
    return new TypeError("".concat(componentName, ": after all ").concat(specifiers.length, " specifiers matched, ").concat(chunks.length, " types of items were remaining."));
  }

  return null;
}

var specifierValidator = (0, _withShape["default"])((0, _object["default"])(), specifierShape).isRequired;

function sequenceOfValidator() {
  for (var _len2 = arguments.length, specifiers = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    specifiers[_key2] = arguments[_key2];
  }

  if (specifiers.length === 0) {
    throw new RangeError('sequenceOf: at least one specifier is required');
  }

  var errors = specifiers.map(function (specifier, i) {
    return specifierValidator({
      specifier: specifier
    }, 'specifier', 'sequenceOf specifier', "suequenceOf specifier, index ".concat(i), "specifier, index ".concat(i));
  });

  if (errors.some(Boolean)) {
    throw new TypeError("\n      sequenceOf: all specifiers must match the appropriate shape.\n\n      Errors:\n        ".concat(errors.map(function (e, i) {
      return " - Argument index ".concat(i, ": ").concat(e.message);
    }).join(',\n        '), "\n    "));
  }

  var validator = function sequenceOf(props, propName) {
    var propValue = props[propName];

    if (propValue == null) {
      return null;
    }

    for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      rest[_key3 - 2] = arguments[_key3];
    }

    var error = _propTypes.array.apply(void 0, [props, propName].concat(rest));

    if (error) {
      return error;
    }

    return validateChunks.apply(void 0, [specifiers, props, propName].concat(rest));
  };

  validator.isRequired = function sequenceOfRequired(props, propName, componentName) {
    for (var _len4 = arguments.length, rest = new Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
      rest[_key4 - 3] = arguments[_key4];
    }

    var error = _propTypes.array.isRequired.apply(_propTypes.array, [props, propName, componentName].concat(rest));

    if (error) {
      return error;
    }

    return validateChunks.apply(void 0, [specifiers, props, propName, componentName].concat(rest));
  };

  return (0, _wrapValidator["default"])(validator, 'sequenceOf', specifiers);
}
//# sourceMappingURL=sequenceOf.js.map