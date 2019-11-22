"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _helperPluginUtils() {
  const data = require("@babel/helper-plugin-utils");

  _helperPluginUtils = function () {
    return data;
  };

  return data;
}

function _pluginSyntaxNumericSeparator() {
  const data = _interopRequireDefault(require("@babel/plugin-syntax-numeric-separator"));

  _pluginSyntaxNumericSeparator = function () {
    return data;
  };

  return data;
}

function _core() {
  const data = require("@babel/core");

  _core = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils().declare)(api => {
  api.assertVersion(7);

  function replaceNumberArg({
    node
  }) {
    if (node.callee.name !== "Number") {
      return;
    }

    const arg = node.arguments[0];

    if (!_core().types.isStringLiteral(arg)) {
      return;
    }

    arg.value = arg.value.replace(/_/g, "");
  }

  return {
    name: "proposal-numeric-separator",
    inherits: _pluginSyntaxNumericSeparator().default,
    visitor: {
      CallExpression: replaceNumberArg,
      NewExpression: replaceNumberArg,

      NumericLiteral({
        node
      }) {
        const {
          extra
        } = node;

        if (extra && /_/.test(extra.raw)) {
          extra.raw = extra.raw.replace(/_/g, "");
        }
      }

    }
  };
});

exports.default = _default;