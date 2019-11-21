'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeContextTypes = exports.treeContextTypes = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Thought we still use `cloneElement` to pass `key`,
 * other props can pass with context for future refactor.
 */
var treeContextTypes = exports.treeContextTypes = {
  rcTree: _propTypes2['default'].shape({
    root: _propTypes2['default'].object,

    prefixCls: _propTypes2['default'].string,
    selectable: _propTypes2['default'].bool,
    showIcon: _propTypes2['default'].bool,
    icon: _propTypes2['default'].oneOfType([_propTypes2['default'].node, _propTypes2['default'].func]),
    draggable: _propTypes2['default'].bool,
    checkable: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].node]),
    checkStrictly: _propTypes2['default'].bool,
    disabled: _propTypes2['default'].bool,
    openTransitionName: _propTypes2['default'].string,
    openAnimation: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].object]),

    loadData: _propTypes2['default'].func,
    filterTreeNode: _propTypes2['default'].func,
    renderTreeNode: _propTypes2['default'].func,

    isKeyChecked: _propTypes2['default'].func,

    onNodeClick: _propTypes2['default'].func,
    onNodeDoubleClick: _propTypes2['default'].func,
    onNodeExpand: _propTypes2['default'].func,
    onNodeSelect: _propTypes2['default'].func,
    onNodeCheck: _propTypes2['default'].func,
    onNodeMouseEnter: _propTypes2['default'].func,
    onNodeMouseLeave: _propTypes2['default'].func,
    onNodeContextMenu: _propTypes2['default'].func,
    onNodeDragStart: _propTypes2['default'].func,
    onNodeDragEnter: _propTypes2['default'].func,
    onNodeDragOver: _propTypes2['default'].func,
    onNodeDragLeave: _propTypes2['default'].func,
    onNodeDragEnd: _propTypes2['default'].func,
    onNodeDrop: _propTypes2['default'].func

    // TODO: Remove this
    // onBatchNodeCheck: PropTypes.func,
    // onCheckConductFinished: PropTypes.func,

    // Tree will store the entities when the treeNode refresh.
    // User can pass the func to add more info to customize the additional info.
    // processTreeEntity: PropTypes.func,
  })
}; /**
    * Webpack has bug for import loop, which is not the same behavior as ES module.
    * When util.js imports the TreeNode for tree generate will cause treeContextTypes be empty.
    */

var nodeContextTypes = exports.nodeContextTypes = (0, _extends3['default'])({}, treeContextTypes, {
  rcTreeNode: _propTypes2['default'].shape({
    onUpCheckConduct: _propTypes2['default'].func
  })
});