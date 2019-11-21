'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _toArray = require('rc-util/lib/Children/toArray');

var _toArray2 = _interopRequireDefault(_toArray);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _contextTypes = require('./contextTypes');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Tree = function (_React$Component) {
  (0, _inherits3['default'])(Tree, _React$Component);

  function Tree(props) {
    (0, _classCallCheck3['default'])(this, Tree);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Tree.__proto__ || Object.getPrototypeOf(Tree)).call(this, props));

    _this.onNodeDragStart = function (event, node) {
      var expandedKeys = _this.state.expandedKeys;
      var onDragStart = _this.props.onDragStart;
      var _node$props = node.props,
          eventKey = _node$props.eventKey,
          children = _node$props.children;


      _this.dragNode = node;

      _this.setState({
        dragNodesKeys: (0, _util.getDragNodesKeys)(children, node),
        expandedKeys: (0, _util.arrDel)(expandedKeys, eventKey)
      });

      if (onDragStart) {
        onDragStart({ event: event, node: node });
      }
    };

    _this.onNodeDragEnter = function (event, node) {
      var expandedKeys = _this.state.expandedKeys;
      var onDragEnter = _this.props.onDragEnter;
      var _node$props2 = node.props,
          pos = _node$props2.pos,
          eventKey = _node$props2.eventKey;


      if (!_this.dragNode) return;

      var dropPosition = (0, _util.calcDropPosition)(event, node);

      // Skip if drag node is self
      if (_this.dragNode.props.eventKey === eventKey && dropPosition === 0) {
        _this.setState({
          dragOverNodeKey: '',
          dropPosition: null
        });
        return;
      }

      // Ref: https://github.com/react-component/tree/issues/132
      // Add timeout to let onDragLevel fire before onDragEnter,
      // so that we can clean drag props for onDragLeave node.
      // Macro task for this:
      // https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script
      setTimeout(function () {
        // Update drag over node
        _this.setState({
          dragOverNodeKey: eventKey,
          dropPosition: dropPosition
        });

        // Side effect for delay drag
        if (!_this.delayedDragEnterLogic) {
          _this.delayedDragEnterLogic = {};
        }
        Object.keys(_this.delayedDragEnterLogic).forEach(function (key) {
          clearTimeout(_this.delayedDragEnterLogic[key]);
        });
        _this.delayedDragEnterLogic[pos] = setTimeout(function () {
          var newExpandedKeys = (0, _util.arrAdd)(expandedKeys, eventKey);
          if (!('expandedKeys' in _this.props)) {
            _this.setState({
              expandedKeys: newExpandedKeys
            });
          }

          if (onDragEnter) {
            onDragEnter({ event: event, node: node, expandedKeys: newExpandedKeys });
          }
        }, 400);
      }, 0);
    };

    _this.onNodeDragOver = function (event, node) {
      var onDragOver = _this.props.onDragOver;
      var eventKey = node.props.eventKey;

      // Update drag position

      if (_this.dragNode && eventKey === _this.state.dragOverNodeKey) {
        var dropPosition = (0, _util.calcDropPosition)(event, node);

        if (dropPosition === _this.state.dropPosition) return;

        _this.setState({
          dropPosition: dropPosition
        });
      }

      if (onDragOver) {
        onDragOver({ event: event, node: node });
      }
    };

    _this.onNodeDragLeave = function (event, node) {
      var onDragLeave = _this.props.onDragLeave;


      _this.setState({
        dragOverNodeKey: ''
      });

      if (onDragLeave) {
        onDragLeave({ event: event, node: node });
      }
    };

    _this.onNodeDragEnd = function (event, node) {
      var onDragEnd = _this.props.onDragEnd;

      _this.setState({
        dragOverNodeKey: ''
      });
      if (onDragEnd) {
        onDragEnd({ event: event, node: node });
      }

      _this.dragNode = null;
    };

    _this.onNodeDrop = function (event, node) {
      var _this$state = _this.state,
          _this$state$dragNodes = _this$state.dragNodesKeys,
          dragNodesKeys = _this$state$dragNodes === undefined ? [] : _this$state$dragNodes,
          dropPosition = _this$state.dropPosition;
      var onDrop = _this.props.onDrop;
      var _node$props3 = node.props,
          eventKey = _node$props3.eventKey,
          pos = _node$props3.pos;


      _this.setState({
        dragOverNodeKey: ''
      });

      if (dragNodesKeys.indexOf(eventKey) !== -1) {
        (0, _warning2['default'])(false, 'Can not drop to dragNode(include it\'s children node)');
        return;
      }

      var posArr = (0, _util.posToArr)(pos);

      var dropResult = {
        event: event,
        node: node,
        dragNode: _this.dragNode,
        dragNodesKeys: dragNodesKeys.slice(),
        dropPosition: dropPosition + Number(posArr[posArr.length - 1])
      };

      if (dropPosition !== 0) {
        dropResult.dropToGap = true;
      }

      if (onDrop) {
        onDrop(dropResult);
      }

      _this.dragNode = null;
    };

    _this.onNodeClick = function (e, treeNode) {
      var onClick = _this.props.onClick;

      if (onClick) {
        onClick(e, treeNode);
      }
    };

    _this.onNodeDoubleClick = function (e, treeNode) {
      var onDoubleClick = _this.props.onDoubleClick;

      if (onDoubleClick) {
        onDoubleClick(e, treeNode);
      }
    };

    _this.onNodeSelect = function (e, treeNode) {
      var selectedKeys = _this.state.selectedKeys;
      var keyEntities = _this.state.keyEntities;
      var _this$props = _this.props,
          onSelect = _this$props.onSelect,
          multiple = _this$props.multiple;
      var _treeNode$props = treeNode.props,
          selected = _treeNode$props.selected,
          eventKey = _treeNode$props.eventKey;

      var targetSelected = !selected;

      // Update selected keys
      if (!targetSelected) {
        selectedKeys = (0, _util.arrDel)(selectedKeys, eventKey);
      } else if (!multiple) {
        selectedKeys = [eventKey];
      } else {
        selectedKeys = (0, _util.arrAdd)(selectedKeys, eventKey);
      }

      // [Legacy] Not found related usage in doc or upper libs
      var selectedNodes = selectedKeys.map(function (key) {
        var entity = keyEntities[key];
        if (!entity) return null;

        return entity.node;
      }).filter(function (node) {
        return node;
      });

      _this.setUncontrolledState({ selectedKeys: selectedKeys });

      if (onSelect) {
        var eventObj = {
          event: 'select',
          selected: targetSelected,
          node: treeNode,
          selectedNodes: selectedNodes,
          nativeEvent: e.nativeEvent
        };
        onSelect(selectedKeys, eventObj);
      }
    };

    _this.onNodeCheck = function (e, treeNode, checked) {
      var _this$state2 = _this.state,
          keyEntities = _this$state2.keyEntities,
          oriCheckedKeys = _this$state2.checkedKeys,
          oriHalfCheckedKeys = _this$state2.halfCheckedKeys;
      var _this$props2 = _this.props,
          checkStrictly = _this$props2.checkStrictly,
          onCheck = _this$props2.onCheck;
      var eventKey = treeNode.props.eventKey;

      // Prepare trigger arguments

      var checkedObj = void 0;
      var eventObj = {
        event: 'check',
        node: treeNode,
        checked: checked,
        nativeEvent: e.nativeEvent
      };

      if (checkStrictly) {
        var checkedKeys = checked ? (0, _util.arrAdd)(oriCheckedKeys, eventKey) : (0, _util.arrDel)(oriCheckedKeys, eventKey);
        var halfCheckedKeys = (0, _util.arrDel)(oriHalfCheckedKeys, eventKey);
        checkedObj = { checked: checkedKeys, halfChecked: halfCheckedKeys };

        eventObj.checkedNodes = checkedKeys.map(function (key) {
          return keyEntities[key];
        }).filter(function (entity) {
          return entity;
        }).map(function (entity) {
          return entity.node;
        });

        _this.setUncontrolledState({ checkedKeys: checkedKeys });
      } else {
        var _conductCheck = (0, _util.conductCheck)([eventKey], checked, keyEntities, {
          checkedKeys: oriCheckedKeys, halfCheckedKeys: oriHalfCheckedKeys
        }),
            _checkedKeys = _conductCheck.checkedKeys,
            _halfCheckedKeys = _conductCheck.halfCheckedKeys;

        checkedObj = _checkedKeys;

        // [Legacy] This is used for `rc-tree-select`
        eventObj.checkedNodes = [];
        eventObj.checkedNodesPositions = [];
        eventObj.halfCheckedKeys = _halfCheckedKeys;

        _checkedKeys.forEach(function (key) {
          var entity = keyEntities[key];
          if (!entity) return;

          var node = entity.node,
              pos = entity.pos;


          eventObj.checkedNodes.push(node);
          eventObj.checkedNodesPositions.push({ node: node, pos: pos });
        });

        _this.setUncontrolledState({
          checkedKeys: _checkedKeys,
          halfCheckedKeys: _halfCheckedKeys
        });
      }

      if (onCheck) {
        onCheck(checkedObj, eventObj);
      }
    };

    _this.onNodeLoad = function (treeNode) {
      return new Promise(function (resolve) {
        // We need to get the latest state of loading/loaded keys
        _this.setState(function (_ref) {
          var _ref$loadedKeys = _ref.loadedKeys,
              loadedKeys = _ref$loadedKeys === undefined ? [] : _ref$loadedKeys,
              _ref$loadingKeys = _ref.loadingKeys,
              loadingKeys = _ref$loadingKeys === undefined ? [] : _ref$loadingKeys;
          var _this$props3 = _this.props,
              loadData = _this$props3.loadData,
              onLoad = _this$props3.onLoad;
          var eventKey = treeNode.props.eventKey;


          if (!loadData || loadedKeys.indexOf(eventKey) !== -1 || loadingKeys.indexOf(eventKey) !== -1) {
            // react 15 will warn if return null
            return {};
          }

          // Process load data
          var promise = loadData(treeNode);
          promise.then(function () {
            var newLoadedKeys = (0, _util.arrAdd)(_this.state.loadedKeys, eventKey);
            var newLoadingKeys = (0, _util.arrDel)(_this.state.loadingKeys, eventKey);

            // onLoad should trigger before internal setState to avoid `loadData` trigger twice.
            // https://github.com/ant-design/ant-design/issues/12464
            if (onLoad) {
              var eventObj = {
                event: 'load',
                node: treeNode
              };
              onLoad(newLoadedKeys, eventObj);
            }

            _this.setUncontrolledState({
              loadedKeys: newLoadedKeys
            });
            _this.setState({
              loadingKeys: newLoadingKeys
            });

            resolve();
          });

          return {
            loadingKeys: (0, _util.arrAdd)(loadingKeys, eventKey)
          };
        });
      });
    };

    _this.onNodeExpand = function (e, treeNode) {
      var expandedKeys = _this.state.expandedKeys;
      var _this$props4 = _this.props,
          onExpand = _this$props4.onExpand,
          loadData = _this$props4.loadData;
      var _treeNode$props2 = treeNode.props,
          eventKey = _treeNode$props2.eventKey,
          expanded = _treeNode$props2.expanded;

      // Update selected keys

      var index = expandedKeys.indexOf(eventKey);
      var targetExpanded = !expanded;

      (0, _warning2['default'])(expanded && index !== -1 || !expanded && index === -1, 'Expand state not sync with index check');

      if (targetExpanded) {
        expandedKeys = (0, _util.arrAdd)(expandedKeys, eventKey);
      } else {
        expandedKeys = (0, _util.arrDel)(expandedKeys, eventKey);
      }

      _this.setUncontrolledState({ expandedKeys: expandedKeys });

      if (onExpand) {
        onExpand(expandedKeys, {
          node: treeNode,
          expanded: targetExpanded,
          nativeEvent: e.nativeEvent
        });
      }

      // Async Load data
      if (targetExpanded && loadData) {
        var loadPromise = _this.onNodeLoad(treeNode);
        return loadPromise ? loadPromise.then(function () {
          // [Legacy] Refresh logic
          _this.setUncontrolledState({ expandedKeys: expandedKeys });
        }) : null;
      }

      return null;
    };

    _this.onNodeMouseEnter = function (event, node) {
      var onMouseEnter = _this.props.onMouseEnter;

      if (onMouseEnter) {
        onMouseEnter({ event: event, node: node });
      }
    };

    _this.onNodeMouseLeave = function (event, node) {
      var onMouseLeave = _this.props.onMouseLeave;

      if (onMouseLeave) {
        onMouseLeave({ event: event, node: node });
      }
    };

    _this.onNodeContextMenu = function (event, node) {
      var onRightClick = _this.props.onRightClick;

      if (onRightClick) {
        event.preventDefault();
        onRightClick({ event: event, node: node });
      }
    };

    _this.setUncontrolledState = function (state) {
      var needSync = false;
      var newState = {};

      Object.keys(state).forEach(function (name) {
        if (name in _this.props) return;

        needSync = true;
        newState[name] = state[name];
      });

      if (needSync) {
        _this.setState(newState);
      }
    };

    _this.registerTreeNode = function (key, node) {
      if (node) {
        _this.domTreeNodes[key] = node;
      } else {
        delete _this.domTreeNodes[key];
      }
    };

    _this.isKeyChecked = function (key) {
      var _this$state$checkedKe = _this.state.checkedKeys,
          checkedKeys = _this$state$checkedKe === undefined ? [] : _this$state$checkedKe;

      return checkedKeys.indexOf(key) !== -1;
    };

    _this.renderTreeNode = function (child, index) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var _this$state3 = _this.state,
          keyEntities = _this$state3.keyEntities,
          _this$state3$expanded = _this$state3.expandedKeys,
          expandedKeys = _this$state3$expanded === undefined ? [] : _this$state3$expanded,
          _this$state3$selected = _this$state3.selectedKeys,
          selectedKeys = _this$state3$selected === undefined ? [] : _this$state3$selected,
          _this$state3$halfChec = _this$state3.halfCheckedKeys,
          halfCheckedKeys = _this$state3$halfChec === undefined ? [] : _this$state3$halfChec,
          _this$state3$loadedKe = _this$state3.loadedKeys,
          loadedKeys = _this$state3$loadedKe === undefined ? [] : _this$state3$loadedKe,
          _this$state3$loadingK = _this$state3.loadingKeys,
          loadingKeys = _this$state3$loadingK === undefined ? [] : _this$state3$loadingK,
          dragOverNodeKey = _this$state3.dragOverNodeKey,
          dropPosition = _this$state3.dropPosition;

      var pos = (0, _util.getPosition)(level, index);
      var key = child.key || pos;

      if (!keyEntities[key]) {
        (0, _util.warnOnlyTreeNode)();
        return null;
      }

      return _react2['default'].cloneElement(child, {
        key: key,
        eventKey: key,
        expanded: expandedKeys.indexOf(key) !== -1,
        selected: selectedKeys.indexOf(key) !== -1,
        loaded: loadedKeys.indexOf(key) !== -1,
        loading: loadingKeys.indexOf(key) !== -1,
        checked: _this.isKeyChecked(key),
        halfChecked: halfCheckedKeys.indexOf(key) !== -1,
        pos: pos,

        // [Legacy] Drag props
        dragOver: dragOverNodeKey === key && dropPosition === 0,
        dragOverGapTop: dragOverNodeKey === key && dropPosition === -1,
        dragOverGapBottom: dragOverNodeKey === key && dropPosition === 1
      });
    };

    _this.state = {
      // TODO: Remove this eslint
      posEntities: {}, // eslint-disable-line react/no-unused-state
      keyEntities: {},

      selectedKeys: [],
      checkedKeys: [],
      halfCheckedKeys: [],
      loadedKeys: [],
      loadingKeys: [],

      treeNode: []
    };

    // Internal usage for `rc-tree-select`, we don't promise it will not change.
    _this.domTreeNodes = {};
    return _this;
  }

  (0, _createClass3['default'])(Tree, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _props = this.props,
          prefixCls = _props.prefixCls,
          selectable = _props.selectable,
          showIcon = _props.showIcon,
          icon = _props.icon,
          draggable = _props.draggable,
          checkable = _props.checkable,
          checkStrictly = _props.checkStrictly,
          disabled = _props.disabled,
          loadData = _props.loadData,
          filterTreeNode = _props.filterTreeNode,
          motion = _props.motion,
          switcherIcon = _props.switcherIcon;


      return {
        rcTree: {
          // root: this,

          prefixCls: prefixCls,
          selectable: selectable,
          showIcon: showIcon,
          icon: icon,
          switcherIcon: switcherIcon,
          draggable: draggable,
          checkable: checkable,
          checkStrictly: checkStrictly,
          disabled: disabled,
          motion: motion,

          loadData: loadData,
          filterTreeNode: filterTreeNode,
          renderTreeNode: this.renderTreeNode,
          isKeyChecked: this.isKeyChecked,

          onNodeClick: this.onNodeClick,
          onNodeDoubleClick: this.onNodeDoubleClick,
          onNodeExpand: this.onNodeExpand,
          onNodeSelect: this.onNodeSelect,
          onNodeCheck: this.onNodeCheck,
          onNodeLoad: this.onNodeLoad,
          onNodeMouseEnter: this.onNodeMouseEnter,
          onNodeMouseLeave: this.onNodeMouseLeave,
          onNodeContextMenu: this.onNodeContextMenu,
          onNodeDragStart: this.onNodeDragStart,
          onNodeDragEnter: this.onNodeDragEnter,
          onNodeDragOver: this.onNodeDragOver,
          onNodeDragLeave: this.onNodeDragLeave,
          onNodeDragEnd: this.onNodeDragEnd,
          onNodeDrop: this.onNodeDrop,

          registerTreeNode: this.registerTreeNode
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var treeNode = this.state.treeNode;
      var _props2 = this.props,
          prefixCls = _props2.prefixCls,
          className = _props2.className,
          focusable = _props2.focusable,
          style = _props2.style,
          showLine = _props2.showLine,
          _props2$tabIndex = _props2.tabIndex,
          tabIndex = _props2$tabIndex === undefined ? 0 : _props2$tabIndex;

      var domProps = (0, _util.getDataAndAria)(this.props);

      if (focusable) {
        domProps.tabIndex = tabIndex;
        domProps.onKeyDown = this.onKeyDown;
      }

      return _react2['default'].createElement(
        'ul',
        (0, _extends3['default'])({}, domProps, {
          className: (0, _classnames2['default'])(prefixCls, className, (0, _defineProperty3['default'])({}, prefixCls + '-show-line', showLine)),
          style: style,
          role: 'tree',
          unselectable: 'on'
        }),
        (0, _util.mapChildren)(treeNode, function (node, index) {
          return _this2.renderTreeNode(node, index);
        })
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(props, prevState) {
      var prevProps = prevState.prevProps;

      var newState = {
        prevProps: props
      };

      function needSync(name) {
        return !prevProps && name in props || prevProps && prevProps[name] !== props[name];
      }

      // ================== Tree Node ==================
      var treeNode = null;

      // Check if `treeData` or `children` changed and save into the state.
      if (needSync('treeData')) {
        treeNode = (0, _util.convertDataToTree)(props.treeData);
      } else if (needSync('children')) {
        treeNode = (0, _toArray2['default'])(props.children);
      }

      // Tree support filter function which will break the tree structure in the vdm.
      // We cache the treeNodes in state so that we can return the treeNode in event trigger.
      if (treeNode) {
        newState.treeNode = treeNode;

        // Calculate the entities data for quick match
        var entitiesMap = (0, _util.convertTreeToEntities)(treeNode);
        newState.posEntities = entitiesMap.posEntities;
        newState.keyEntities = entitiesMap.keyEntities;
      }

      var keyEntities = newState.keyEntities || prevState.keyEntities;

      // ================ expandedKeys =================
      if (needSync('expandedKeys') || prevProps && needSync('autoExpandParent')) {
        newState.expandedKeys = props.autoExpandParent || !prevProps && props.defaultExpandParent ? (0, _util.conductExpandParent)(props.expandedKeys, keyEntities) : props.expandedKeys;
      } else if (!prevProps && props.defaultExpandAll) {
        newState.expandedKeys = Object.keys(keyEntities);
      } else if (!prevProps && props.defaultExpandedKeys) {
        newState.expandedKeys = props.autoExpandParent || props.defaultExpandParent ? (0, _util.conductExpandParent)(props.defaultExpandedKeys, keyEntities) : props.defaultExpandedKeys;
      }

      // ================ selectedKeys =================
      if (props.selectable) {
        if (needSync('selectedKeys')) {
          newState.selectedKeys = (0, _util.calcSelectedKeys)(props.selectedKeys, props);
        } else if (!prevProps && props.defaultSelectedKeys) {
          newState.selectedKeys = (0, _util.calcSelectedKeys)(props.defaultSelectedKeys, props);
        }
      }

      // ================= checkedKeys =================
      if (props.checkable) {
        var checkedKeyEntity = void 0;

        if (needSync('checkedKeys')) {
          checkedKeyEntity = (0, _util.parseCheckedKeys)(props.checkedKeys) || {};
        } else if (!prevProps && props.defaultCheckedKeys) {
          checkedKeyEntity = (0, _util.parseCheckedKeys)(props.defaultCheckedKeys) || {};
        } else if (treeNode) {
          // If treeNode changed, we also need check it
          checkedKeyEntity = (0, _util.parseCheckedKeys)(props.checkedKeys) || {
            checkedKeys: prevState.checkedKeys,
            halfCheckedKeys: prevState.halfCheckedKeys
          };
        }

        if (checkedKeyEntity) {
          var _checkedKeyEntity = checkedKeyEntity,
              _checkedKeyEntity$che = _checkedKeyEntity.checkedKeys,
              checkedKeys = _checkedKeyEntity$che === undefined ? [] : _checkedKeyEntity$che,
              _checkedKeyEntity$hal = _checkedKeyEntity.halfCheckedKeys,
              halfCheckedKeys = _checkedKeyEntity$hal === undefined ? [] : _checkedKeyEntity$hal;


          if (!props.checkStrictly) {
            var conductKeys = (0, _util.conductCheck)(checkedKeys, true, keyEntities);
            checkedKeys = conductKeys.checkedKeys;
            halfCheckedKeys = conductKeys.halfCheckedKeys;
          }

          newState.checkedKeys = checkedKeys;
          newState.halfCheckedKeys = halfCheckedKeys;
        }
      }
      // ================= loadedKeys ==================
      if (needSync('loadedKeys')) {
        newState.loadedKeys = props.loadedKeys;
      }

      return newState;
    }

    /**
     * [Legacy] Select handler is less small than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */


    /**
     * Only update the value which is not in props
     */


    /**
     * [Legacy] Original logic use `key` as tracking clue.
     * We have to use `cloneElement` to pass `key`.
     */

  }]);
  return Tree;
}(_react2['default'].Component);

Tree.propTypes = {
  prefixCls: _propTypes2['default'].string,
  className: _propTypes2['default'].string,
  style: _propTypes2['default'].object,
  tabIndex: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]),
  children: _propTypes2['default'].any,
  treeData: _propTypes2['default'].array, // Generate treeNode by children
  showLine: _propTypes2['default'].bool,
  showIcon: _propTypes2['default'].bool,
  icon: _propTypes2['default'].oneOfType([_propTypes2['default'].node, _propTypes2['default'].func]),
  focusable: _propTypes2['default'].bool,
  selectable: _propTypes2['default'].bool,
  disabled: _propTypes2['default'].bool,
  multiple: _propTypes2['default'].bool,
  checkable: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].node]),
  checkStrictly: _propTypes2['default'].bool,
  draggable: _propTypes2['default'].bool,
  defaultExpandParent: _propTypes2['default'].bool,
  autoExpandParent: _propTypes2['default'].bool,
  defaultExpandAll: _propTypes2['default'].bool,
  defaultExpandedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  expandedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  defaultCheckedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  checkedKeys: _propTypes2['default'].oneOfType([_propTypes2['default'].arrayOf(_propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number])), _propTypes2['default'].object]),
  defaultSelectedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  selectedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  onClick: _propTypes2['default'].func,
  onDoubleClick: _propTypes2['default'].func,
  onExpand: _propTypes2['default'].func,
  onCheck: _propTypes2['default'].func,
  onSelect: _propTypes2['default'].func,
  onLoad: _propTypes2['default'].func,
  loadData: _propTypes2['default'].func,
  loadedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  onMouseEnter: _propTypes2['default'].func,
  onMouseLeave: _propTypes2['default'].func,
  onRightClick: _propTypes2['default'].func,
  onDragStart: _propTypes2['default'].func,
  onDragEnter: _propTypes2['default'].func,
  onDragOver: _propTypes2['default'].func,
  onDragLeave: _propTypes2['default'].func,
  onDragEnd: _propTypes2['default'].func,
  onDrop: _propTypes2['default'].func,
  filterTreeNode: _propTypes2['default'].func,
  motion: _propTypes2['default'].object,
  switcherIcon: _propTypes2['default'].oneOfType([_propTypes2['default'].node, _propTypes2['default'].func])
};
Tree.childContextTypes = _contextTypes.treeContextTypes;
Tree.defaultProps = {
  prefixCls: 'rc-tree',
  showLine: false,
  showIcon: true,
  selectable: true,
  multiple: false,
  checkable: false,
  disabled: false,
  checkStrictly: false,
  draggable: false,
  defaultExpandParent: true,
  autoExpandParent: false,
  defaultExpandAll: false,
  defaultExpandedKeys: [],
  defaultCheckedKeys: [],
  defaultSelectedKeys: []
};


(0, _reactLifecyclesCompat.polyfill)(Tree);

exports['default'] = Tree;
module.exports = exports['default'];