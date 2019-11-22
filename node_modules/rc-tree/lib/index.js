"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TreeNode", {
  enumerable: true,
  get: function get() {
    return _TreeNode.default;
  }
});
exports.default = void 0;

var _Tree = _interopRequireDefault(require("./Tree"));

var _TreeNode = _interopRequireDefault(require("./TreeNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tree = _Tree.default;
Tree.TreeNode = _TreeNode.default;
var _default = Tree;
exports.default = _default;