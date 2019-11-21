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

function _pluginSyntaxNullishCoalescingOperator() {
  const data = _interopRequireDefault(require("@babel/plugin-syntax-nullish-coalescing-operator"));

  _pluginSyntaxNullishCoalescingOperator = function () {
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

var _default = (0, _helperPluginUtils().declare)((api, {
  loose = false
}) => {
  api.assertVersion(7);
  return {
    name: "proposal-nullish-coalescing-operator",
    inherits: _pluginSyntaxNullishCoalescingOperator().default,
    visitor: {
      LogicalExpression(path) {
        const {
          node,
          scope
        } = path;

        if (node.operator !== "??") {
          return;
        }

        const ref = scope.generateUidIdentifierBasedOnNode(node.left);
        scope.push({
          id: ref
        });

        const assignment = _core().types.assignmentExpression("=", _core().types.cloneNode(ref), node.left);

        path.replaceWith(_core().types.conditionalExpression(loose ? _core().types.binaryExpression("!=", assignment, _core().types.nullLiteral()) : _core().types.logicalExpression("&&", _core().types.binaryExpression("!==", assignment, _core().types.nullLiteral()), _core().types.binaryExpression("!==", _core().types.cloneNode(ref), scope.buildUndefinedNode())), _core().types.cloneNode(ref), node.right));
      }

    }
  };
});

exports.default = _default;