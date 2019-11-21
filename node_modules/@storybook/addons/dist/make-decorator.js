"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeDecorator = void 0;

var _utilDeprecate = _interopRequireDefault(require("util-deprecate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var makeDecorator = function makeDecorator(_ref) {
  var name = _ref.name,
      parameterName = _ref.parameterName,
      wrapper = _ref.wrapper,
      _ref$skipIfNoParamete = _ref.skipIfNoParametersOrOptions,
      skipIfNoParametersOrOptions = _ref$skipIfNoParamete === void 0 ? false : _ref$skipIfNoParamete,
      _ref$allowDeprecatedU = _ref.allowDeprecatedUsage,
      allowDeprecatedUsage = _ref$allowDeprecatedU === void 0 ? false : _ref$allowDeprecatedU;

  var decorator = function decorator(options) {
    return function (getStory, context) {
      var parameters = context.parameters && context.parameters[parameterName];

      if (parameters && parameters.disable) {
        return getStory(context);
      }

      if (skipIfNoParametersOrOptions && !options && !parameters) {
        return getStory(context);
      }

      return wrapper(getStory, context, {
        options: options,
        parameters: parameters
      });
    };
  };

  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // Used without options as .addDecorator(decorator)
    if (typeof args[0] === 'function') {
      return decorator().apply(void 0, args);
    }

    return function () {
      for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        innerArgs[_key2] = arguments[_key2];
      }

      // Used as [.]addDecorator(decorator(options))
      if (innerArgs.length > 1) {
        return decorator.apply(void 0, args).apply(void 0, innerArgs);
      }

      if (allowDeprecatedUsage) {
        // Used to wrap a story directly .add('story', decorator(options)(() => <Story />))
        //   This is now deprecated:
        return (0, _utilDeprecate["default"])(function (context) {
          return decorator.apply(void 0, args)(innerArgs[0], context);
        }, "Passing stories directly into ".concat(name, "() is deprecated,\n          instead use addDecorator(").concat(name, ") and pass options with the '").concat(parameterName, "' parameter"));
      }

      throw new Error("Passing stories directly into ".concat(name, "() is not allowed,\n        instead use addDecorator(").concat(name, ") and pass options with the '").concat(parameterName, "' parameter"));
    };
  };
};

exports.makeDecorator = makeDecorator;