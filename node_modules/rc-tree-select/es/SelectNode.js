function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import { TreeNode } from 'rc-tree';
import { valueProp } from './propTypes';
/**
 * SelectNode wrapped the tree node.
 * Let's use SelectNode instead of TreeNode
 * since TreeNode is so confuse here.
 */

var SelectNode = function SelectNode(props) {
  return React.createElement(TreeNode, props);
};

SelectNode.propTypes = _objectSpread({}, TreeNode.propTypes, {
  value: valueProp
}); // Let Tree trade as TreeNode to reuse this for performance saving.

SelectNode.isTreeNode = 1;
export default SelectNode;