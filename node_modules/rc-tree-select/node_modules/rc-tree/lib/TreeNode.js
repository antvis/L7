'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _CSSMotion = require('rc-animate/lib/CSSMotion');

var _CSSMotion2 = _interopRequireDefault(_CSSMotion);

var _toArray = require('rc-util/lib/Children/toArray');

var _toArray2 = _interopRequireDefault(_toArray);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _contextTypes = require('./contextTypes');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ICON_OPEN = 'open';
var ICON_CLOSE = 'close';

var defaultTitle = '---';

var TreeNode = function (_React$Component) {
  (0, _inherits3['default'])(TreeNode, _React$Component);

  function TreeNode(props) {
    (0, _classCallCheck3['default'])(this, TreeNode);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (TreeNode.__proto__ || Object.getPrototypeOf(TreeNode)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      dragNodeHighlight: false
    };
    return _this;
  }

  (0, _createClass3['default'])(TreeNode, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return (0, _extends3['default'])({}, this.context, {
        rcTreeNode: {
          // onUpCheckConduct: this.onUpCheckConduct,
        }
      });
    }

    // Isomorphic needn't load data in server side

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var eventKey = this.props.eventKey;
      var registerTreeNode = this.context.rcTree.registerTreeNode;


      this.syncLoadData(this.props);

      registerTreeNode(eventKey, this);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.syncLoadData(this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var eventKey = this.props.eventKey;
      var registerTreeNode = this.context.rcTree.registerTreeNode;

      registerTreeNode(eventKey, null);
    }

    // Disabled item still can be switch


    // Drag usage

  }, {
    key: 'isSelectable',
    value: function isSelectable() {
      var selectable = this.props.selectable;
      var treeSelectable = this.context.rcTree.selectable;

      // Ignore when selectable is undefined or null

      if (typeof selectable === 'boolean') {
        return selectable;
      }

      return treeSelectable;
    }

    // Load data to avoid default expanded tree without data


    // Switcher


    // Checkbox


    // Icon + Title


    // Children list wrapped with `Animation`

  }, {
    key: 'render',
    value: function render() {
      var _classNames;

      var loading = this.props.loading;
      var _props = this.props,
          className = _props.className,
          style = _props.style,
          dragOver = _props.dragOver,
          dragOverGapTop = _props.dragOverGapTop,
          dragOverGapBottom = _props.dragOverGapBottom,
          isLeaf = _props.isLeaf,
          expanded = _props.expanded,
          selected = _props.selected,
          checked = _props.checked,
          halfChecked = _props.halfChecked,
          otherProps = (0, _objectWithoutProperties3['default'])(_props, ['className', 'style', 'dragOver', 'dragOverGapTop', 'dragOverGapBottom', 'isLeaf', 'expanded', 'selected', 'checked', 'halfChecked']);
      var _context$rcTree = this.context.rcTree,
          prefixCls = _context$rcTree.prefixCls,
          filterTreeNode = _context$rcTree.filterTreeNode,
          draggable = _context$rcTree.draggable;

      var disabled = this.isDisabled();
      var dataOrAriaAttributeProps = (0, _util.getDataAndAria)(otherProps);

      return _react2['default'].createElement(
        'li',
        (0, _extends3['default'])({
          className: (0, _classnames2['default'])(className, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-treenode-disabled', disabled), (0, _defineProperty3['default'])(_classNames, prefixCls + '-treenode-switcher-' + (expanded ? 'open' : 'close'), !isLeaf), (0, _defineProperty3['default'])(_classNames, prefixCls + '-treenode-checkbox-checked', checked), (0, _defineProperty3['default'])(_classNames, prefixCls + '-treenode-checkbox-indeterminate', halfChecked), (0, _defineProperty3['default'])(_classNames, prefixCls + '-treenode-selected', selected), (0, _defineProperty3['default'])(_classNames, prefixCls + '-treenode-loading', loading), (0, _defineProperty3['default'])(_classNames, 'drag-over', !disabled && dragOver), (0, _defineProperty3['default'])(_classNames, 'drag-over-gap-top', !disabled && dragOverGapTop), (0, _defineProperty3['default'])(_classNames, 'drag-over-gap-bottom', !disabled && dragOverGapBottom), (0, _defineProperty3['default'])(_classNames, 'filter-node', filterTreeNode && filterTreeNode(this)), _classNames)),

          style: style,

          role: 'treeitem',

          onDragEnter: draggable ? this.onDragEnter : undefined,
          onDragOver: draggable ? this.onDragOver : undefined,
          onDragLeave: draggable ? this.onDragLeave : undefined,
          onDrop: draggable ? this.onDrop : undefined,
          onDragEnd: draggable ? this.onDragEnd : undefined
        }, dataOrAriaAttributeProps),
        this.renderSwitcher(),
        this.renderCheckbox(),
        this.renderSelector(),
        this.renderChildren()
      );
    }
  }]);
  return TreeNode;
}(_react2['default'].Component);

TreeNode.propTypes = {
  eventKey: _propTypes2['default'].string, // Pass by parent `cloneElement`
  prefixCls: _propTypes2['default'].string,
  className: _propTypes2['default'].string,
  style: _propTypes2['default'].object,
  root: _propTypes2['default'].object,
  onSelect: _propTypes2['default'].func,

  // By parent
  expanded: _propTypes2['default'].bool,
  selected: _propTypes2['default'].bool,
  checked: _propTypes2['default'].bool,
  loaded: _propTypes2['default'].bool,
  loading: _propTypes2['default'].bool,
  halfChecked: _propTypes2['default'].bool,
  children: _propTypes2['default'].node,
  title: _propTypes2['default'].node,
  pos: _propTypes2['default'].string,
  dragOver: _propTypes2['default'].bool,
  dragOverGapTop: _propTypes2['default'].bool,
  dragOverGapBottom: _propTypes2['default'].bool,

  // By user
  isLeaf: _propTypes2['default'].bool,
  selectable: _propTypes2['default'].bool,
  disabled: _propTypes2['default'].bool,
  disableCheckbox: _propTypes2['default'].bool,
  icon: _propTypes2['default'].oneOfType([_propTypes2['default'].node, _propTypes2['default'].func]),
  switcherIcon: _propTypes2['default'].oneOfType([_propTypes2['default'].node, _propTypes2['default'].func])
};
TreeNode.contextTypes = _contextTypes.nodeContextTypes;
TreeNode.childContextTypes = _contextTypes.nodeContextTypes;
TreeNode.defaultProps = {
  title: defaultTitle
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onSelectorClick = function (e) {
    // Click trigger before select/check operation
    var onNodeClick = _this2.context.rcTree.onNodeClick;

    onNodeClick(e, _this2);

    if (_this2.isSelectable()) {
      _this2.onSelect(e);
    } else {
      _this2.onCheck(e);
    }
  };

  this.onSelectorDoubleClick = function (e) {
    var onNodeDoubleClick = _this2.context.rcTree.onNodeDoubleClick;

    onNodeDoubleClick(e, _this2);
  };

  this.onSelect = function (e) {
    if (_this2.isDisabled()) return;

    var onNodeSelect = _this2.context.rcTree.onNodeSelect;

    e.preventDefault();
    onNodeSelect(e, _this2);
  };

  this.onCheck = function (e) {
    if (_this2.isDisabled()) return;

    var _props2 = _this2.props,
        disableCheckbox = _props2.disableCheckbox,
        checked = _props2.checked;
    var _context$rcTree2 = _this2.context.rcTree,
        checkable = _context$rcTree2.checkable,
        onNodeCheck = _context$rcTree2.onNodeCheck;


    if (!checkable || disableCheckbox) return;

    e.preventDefault();
    var targetChecked = !checked;
    onNodeCheck(e, _this2, targetChecked);
  };

  this.onMouseEnter = function (e) {
    var onNodeMouseEnter = _this2.context.rcTree.onNodeMouseEnter;

    onNodeMouseEnter(e, _this2);
  };

  this.onMouseLeave = function (e) {
    var onNodeMouseLeave = _this2.context.rcTree.onNodeMouseLeave;

    onNodeMouseLeave(e, _this2);
  };

  this.onContextMenu = function (e) {
    var onNodeContextMenu = _this2.context.rcTree.onNodeContextMenu;

    onNodeContextMenu(e, _this2);
  };

  this.onDragStart = function (e) {
    var onNodeDragStart = _this2.context.rcTree.onNodeDragStart;


    e.stopPropagation();
    _this2.setState({
      dragNodeHighlight: true
    });
    onNodeDragStart(e, _this2);

    try {
      // ie throw error
      // firefox-need-it
      e.dataTransfer.setData('text/plain', '');
    } catch (error) {
      // empty
    }
  };

  this.onDragEnter = function (e) {
    var onNodeDragEnter = _this2.context.rcTree.onNodeDragEnter;


    e.preventDefault();
    e.stopPropagation();
    onNodeDragEnter(e, _this2);
  };

  this.onDragOver = function (e) {
    var onNodeDragOver = _this2.context.rcTree.onNodeDragOver;


    e.preventDefault();
    e.stopPropagation();
    onNodeDragOver(e, _this2);
  };

  this.onDragLeave = function (e) {
    var onNodeDragLeave = _this2.context.rcTree.onNodeDragLeave;


    e.stopPropagation();
    onNodeDragLeave(e, _this2);
  };

  this.onDragEnd = function (e) {
    var onNodeDragEnd = _this2.context.rcTree.onNodeDragEnd;


    e.stopPropagation();
    _this2.setState({
      dragNodeHighlight: false
    });
    onNodeDragEnd(e, _this2);
  };

  this.onDrop = function (e) {
    var onNodeDrop = _this2.context.rcTree.onNodeDrop;


    e.preventDefault();
    e.stopPropagation();
    _this2.setState({
      dragNodeHighlight: false
    });
    onNodeDrop(e, _this2);
  };

  this.onExpand = function (e) {
    var onNodeExpand = _this2.context.rcTree.onNodeExpand;

    onNodeExpand(e, _this2);
  };

  this.setSelectHandle = function (node) {
    _this2.selectHandle = node;
  };

  this.getNodeChildren = function () {
    var children = _this2.props.children;

    var originList = (0, _toArray2['default'])(children).filter(function (node) {
      return node;
    });
    var targetList = (0, _util.getNodeChildren)(originList);

    if (originList.length !== targetList.length) {
      (0, _util.warnOnlyTreeNode)();
    }

    return targetList;
  };

  this.getNodeState = function () {
    var expanded = _this2.props.expanded;


    if (_this2.isLeaf()) {
      return null;
    }

    return expanded ? ICON_OPEN : ICON_CLOSE;
  };

  this.isLeaf = function () {
    var _props3 = _this2.props,
        isLeaf = _props3.isLeaf,
        loaded = _props3.loaded;
    var loadData = _this2.context.rcTree.loadData;


    var hasChildren = _this2.getNodeChildren().length !== 0;

    if (isLeaf === false) {
      return false;
    }

    return isLeaf || !loadData && !hasChildren || loadData && loaded && !hasChildren;
  };

  this.isDisabled = function () {
    var disabled = _this2.props.disabled;
    var treeDisabled = _this2.context.rcTree.disabled;

    // Follow the logic of Selectable

    if (disabled === false) {
      return false;
    }

    return !!(treeDisabled || disabled);
  };

  this.syncLoadData = function (props) {
    var expanded = props.expanded,
        loading = props.loading,
        loaded = props.loaded;
    var _context$rcTree3 = _this2.context.rcTree,
        loadData = _context$rcTree3.loadData,
        onNodeLoad = _context$rcTree3.onNodeLoad;


    if (loading) return;

    // read from state to avoid loadData at same time
    if (loadData && expanded && !_this2.isLeaf()) {
      // We needn't reload data when has children in sync logic
      // It's only needed in node expanded
      var hasChildren = _this2.getNodeChildren().length !== 0;
      if (!hasChildren && !loaded) {
        onNodeLoad(_this2);
      }
    }
  };

  this.renderSwitcher = function () {
    var _props4 = _this2.props,
        expanded = _props4.expanded,
        switcherIconFromProps = _props4.switcherIcon;
    var _context$rcTree4 = _this2.context.rcTree,
        prefixCls = _context$rcTree4.prefixCls,
        switcherIconFromCtx = _context$rcTree4.switcherIcon;


    var switcherIcon = switcherIconFromProps || switcherIconFromCtx;

    if (_this2.isLeaf()) {
      return _react2['default'].createElement(
        'span',
        { className: (0, _classnames2['default'])(prefixCls + '-switcher', prefixCls + '-switcher-noop') },
        typeof switcherIcon === 'function' ? switcherIcon((0, _extends3['default'])({}, _this2.props, { isLeaf: true })) : switcherIcon
      );
    }

    var switcherCls = (0, _classnames2['default'])(prefixCls + '-switcher', prefixCls + '-switcher_' + (expanded ? ICON_OPEN : ICON_CLOSE));
    return _react2['default'].createElement(
      'span',
      { onClick: _this2.onExpand, className: switcherCls },
      typeof switcherIcon === 'function' ? switcherIcon((0, _extends3['default'])({}, _this2.props, { isLeaf: false })) : switcherIcon
    );
  };

  this.renderCheckbox = function () {
    var _props5 = _this2.props,
        checked = _props5.checked,
        halfChecked = _props5.halfChecked,
        disableCheckbox = _props5.disableCheckbox;
    var _context$rcTree5 = _this2.context.rcTree,
        prefixCls = _context$rcTree5.prefixCls,
        checkable = _context$rcTree5.checkable;

    var disabled = _this2.isDisabled();

    if (!checkable) return null;

    // [Legacy] Custom element should be separate with `checkable` in future
    var $custom = typeof checkable !== 'boolean' ? checkable : null;

    return _react2['default'].createElement(
      'span',
      {
        className: (0, _classnames2['default'])(prefixCls + '-checkbox', checked && prefixCls + '-checkbox-checked', !checked && halfChecked && prefixCls + '-checkbox-indeterminate', (disabled || disableCheckbox) && prefixCls + '-checkbox-disabled'),
        onClick: _this2.onCheck
      },
      $custom
    );
  };

  this.renderIcon = function () {
    var loading = _this2.props.loading;
    var prefixCls = _this2.context.rcTree.prefixCls;


    return _react2['default'].createElement('span', {
      className: (0, _classnames2['default'])(prefixCls + '-iconEle', prefixCls + '-icon__' + (_this2.getNodeState() || 'docu'), loading && prefixCls + '-icon_loading')
    });
  };

  this.renderSelector = function () {
    var dragNodeHighlight = _this2.state.dragNodeHighlight;
    var _props6 = _this2.props,
        title = _props6.title,
        selected = _props6.selected,
        icon = _props6.icon,
        loading = _props6.loading;
    var _context$rcTree6 = _this2.context.rcTree,
        prefixCls = _context$rcTree6.prefixCls,
        showIcon = _context$rcTree6.showIcon,
        treeIcon = _context$rcTree6.icon,
        draggable = _context$rcTree6.draggable,
        loadData = _context$rcTree6.loadData;

    var disabled = _this2.isDisabled();

    var wrapClass = prefixCls + '-node-content-wrapper';

    // Icon - Still show loading icon when loading without showIcon
    var $icon = void 0;

    if (showIcon) {
      var currentIcon = icon || treeIcon;

      $icon = currentIcon ? _react2['default'].createElement(
        'span',
        {
          className: (0, _classnames2['default'])(prefixCls + '-iconEle', prefixCls + '-icon__customize')
        },
        typeof currentIcon === 'function' ? _react2['default'].createElement(currentIcon, (0, _extends3['default'])({}, _this2.props)) : currentIcon
      ) : _this2.renderIcon();
    } else if (loadData && loading) {
      $icon = _this2.renderIcon();
    }

    // Title
    var $title = _react2['default'].createElement(
      'span',
      { className: prefixCls + '-title' },
      title
    );

    return _react2['default'].createElement(
      'span',
      {
        ref: _this2.setSelectHandle,
        title: typeof title === 'string' ? title : '',
        className: (0, _classnames2['default'])('' + wrapClass, wrapClass + '-' + (_this2.getNodeState() || 'normal'), !disabled && (selected || dragNodeHighlight) && prefixCls + '-node-selected', !disabled && draggable && 'draggable'),
        draggable: !disabled && draggable || undefined,
        'aria-grabbed': !disabled && draggable || undefined,

        onMouseEnter: _this2.onMouseEnter,
        onMouseLeave: _this2.onMouseLeave,
        onContextMenu: _this2.onContextMenu,
        onClick: _this2.onSelectorClick,
        onDoubleClick: _this2.onSelectorDoubleClick,
        onDragStart: draggable ? _this2.onDragStart : undefined
      },
      $icon,
      $title
    );
  };

  this.renderChildren = function () {
    var _props7 = _this2.props,
        expanded = _props7.expanded,
        pos = _props7.pos;
    var _context$rcTree7 = _this2.context.rcTree,
        prefixCls = _context$rcTree7.prefixCls,
        motion = _context$rcTree7.motion,
        renderTreeNode = _context$rcTree7.renderTreeNode;

    // Children TreeNode

    var nodeList = _this2.getNodeChildren();

    if (nodeList.length === 0) {
      return null;
    }
    return _react2['default'].createElement(
      _CSSMotion2['default'],
      (0, _extends3['default'])({ visible: expanded }, motion),
      function (_ref) {
        var style = _ref.style,
            className = _ref.className;

        return _react2['default'].createElement(
          'ul',
          {
            className: (0, _classnames2['default'])(className, prefixCls + '-child-tree', expanded && prefixCls + '-child-tree-open'),
            style: style,
            'data-expanded': expanded,
            role: 'group'
          },
          (0, _util.mapChildren)(nodeList, function (node, index) {
            return renderTreeNode(node, index, pos);
          })
        );
      }
    );
  };
};

TreeNode.isTreeNode = 1;

(0, _reactLifecyclesCompat.polyfill)(TreeNode);

exports['default'] = TreeNode;
module.exports = exports['default'];