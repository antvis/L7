"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _warning = _interopRequireDefault(require("warning"));

var _toArray = _interopRequireDefault(require("rc-util/lib/Children/toArray"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _contextTypes = require("./contextTypes");

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Tree =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Tree, _React$Component);

  function Tree() {
    var _this;

    _classCallCheck(this, Tree);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tree).apply(this, arguments));
    /** Internal usage for `rc-tree-select`, we don't promise it will not change. */

    _this.domTreeNodes = {};
    _this.state = {
      keyEntities: {},
      selectedKeys: [],
      checkedKeys: [],
      halfCheckedKeys: [],
      loadedKeys: [],
      loadingKeys: [],
      expandedKeys: [],
      dragNodesKeys: [],
      dragOverNodeKey: null,
      dropPosition: null,
      treeNode: [],
      prevProps: null
    };

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
        onDragStart({
          event: event,
          node: node
        });
      }
    };
    /**
     * [Legacy] Select handler is less small than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */


    _this.onNodeDragEnter = function (event, node) {
      var expandedKeys = _this.state.expandedKeys;
      var onDragEnter = _this.props.onDragEnter;
      var _node$props2 = node.props,
          pos = _node$props2.pos,
          eventKey = _node$props2.eventKey;
      if (!_this.dragNode) return;
      var dropPosition = (0, _util.calcDropPosition)(event, node); // Skip if drag node is self

      if (_this.dragNode.props.eventKey === eventKey && dropPosition === 0) {
        _this.setState({
          dragOverNodeKey: '',
          dropPosition: null
        });

        return;
      } // Ref: https://github.com/react-component/tree/issues/132
      // Add timeout to let onDragLevel fire before onDragEnter,
      // so that we can clean drag props for onDragLeave node.
      // Macro task for this:
      // https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script


      setTimeout(function () {
        // Update drag over node
        _this.setState({
          dragOverNodeKey: eventKey,
          dropPosition: dropPosition
        }); // Side effect for delay drag


        if (!_this.delayedDragEnterLogic) {
          _this.delayedDragEnterLogic = {};
        }

        Object.keys(_this.delayedDragEnterLogic).forEach(function (key) {
          clearTimeout(_this.delayedDragEnterLogic[key]);
        });
        _this.delayedDragEnterLogic[pos] = window.setTimeout(function () {
          var newExpandedKeys = (0, _util.arrAdd)(expandedKeys, eventKey);

          if (!('expandedKeys' in _this.props)) {
            _this.setState({
              expandedKeys: newExpandedKeys
            });
          }

          if (onDragEnter) {
            onDragEnter({
              event: event,
              node: node,
              expandedKeys: newExpandedKeys
            });
          }
        }, 400);
      }, 0);
    };

    _this.onNodeDragOver = function (event, node) {
      var onDragOver = _this.props.onDragOver;
      var eventKey = node.props.eventKey; // Update drag position

      if (_this.dragNode && eventKey === _this.state.dragOverNodeKey) {
        var dropPosition = (0, _util.calcDropPosition)(event, node);
        if (dropPosition === _this.state.dropPosition) return;

        _this.setState({
          dropPosition: dropPosition
        });
      }

      if (onDragOver) {
        onDragOver({
          event: event,
          node: node
        });
      }
    };

    _this.onNodeDragLeave = function (event, node) {
      var onDragLeave = _this.props.onDragLeave;

      _this.setState({
        dragOverNodeKey: ''
      });

      if (onDragLeave) {
        onDragLeave({
          event: event,
          node: node
        });
      }
    };

    _this.onNodeDragEnd = function (event, node) {
      var onDragEnd = _this.props.onDragEnd;

      _this.setState({
        dragOverNodeKey: ''
      });

      if (onDragEnd) {
        onDragEnd({
          event: event,
          node: node
        });
      }

      _this.dragNode = null;
    };

    _this.onNodeDrop = function (event, node) {
      var _this$state = _this.state,
          _this$state$dragNodes = _this$state.dragNodesKeys,
          dragNodesKeys = _this$state$dragNodes === void 0 ? [] : _this$state$dragNodes,
          dropPosition = _this$state.dropPosition;
      var onDrop = _this.props.onDrop;
      var _node$props3 = node.props,
          eventKey = _node$props3.eventKey,
          pos = _node$props3.pos;

      _this.setState({
        dragOverNodeKey: ''
      });

      if (dragNodesKeys.indexOf(eventKey) !== -1) {
        (0, _warning.default)(false, "Can not drop to dragNode(include it's children node)");
        return;
      }

      var posArr = (0, _util.posToArr)(pos);
      var dropResult = {
        event: event,
        node: node,
        dragNode: _this.dragNode,
        dragNodesKeys: dragNodesKeys.slice(),
        dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
        dropToGap: false
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
      var targetSelected = !selected; // Update selected keys

      if (!targetSelected) {
        selectedKeys = (0, _util.arrDel)(selectedKeys, eventKey);
      } else if (!multiple) {
        selectedKeys = [eventKey];
      } else {
        selectedKeys = (0, _util.arrAdd)(selectedKeys, eventKey);
      } // [Legacy] Not found related usage in doc or upper libs


      var selectedNodes = selectedKeys.map(function (key) {
        var entity = keyEntities[key];
        if (!entity) return null;
        return entity.node;
      }).filter(function (node) {
        return node;
      });

      _this.setUncontrolledState({
        selectedKeys: selectedKeys
      });

      if (onSelect) {
        onSelect(selectedKeys, {
          event: 'select',
          selected: targetSelected,
          node: treeNode,
          selectedNodes: selectedNodes,
          nativeEvent: e.nativeEvent
        });
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
      var eventKey = treeNode.props.eventKey; // Prepare trigger arguments

      var checkedObj;
      var eventObj = {
        event: 'check',
        node: treeNode,
        checked: checked,
        nativeEvent: e.nativeEvent
      };

      if (checkStrictly) {
        var checkedKeys = checked ? (0, _util.arrAdd)(oriCheckedKeys, eventKey) : (0, _util.arrDel)(oriCheckedKeys, eventKey);
        var halfCheckedKeys = (0, _util.arrDel)(oriHalfCheckedKeys, eventKey);
        checkedObj = {
          checked: checkedKeys,
          halfChecked: halfCheckedKeys
        };
        eventObj.checkedNodes = checkedKeys.map(function (key) {
          return keyEntities[key];
        }).filter(function (entity) {
          return entity;
        }).map(function (entity) {
          return entity.node;
        });

        _this.setUncontrolledState({
          checkedKeys: checkedKeys
        });
      } else {
        var _conductCheck = (0, _util.conductCheck)([eventKey], checked, keyEntities, {
          checkedKeys: oriCheckedKeys,
          halfCheckedKeys: oriHalfCheckedKeys
        }),
            _checkedKeys = _conductCheck.checkedKeys,
            _halfCheckedKeys = _conductCheck.halfCheckedKeys;

        checkedObj = _checkedKeys; // [Legacy] This is used for `rc-tree-select`

        eventObj.checkedNodes = [];
        eventObj.checkedNodesPositions = [];
        eventObj.halfCheckedKeys = _halfCheckedKeys;

        _checkedKeys.forEach(function (key) {
          var entity = keyEntities[key];
          if (!entity) return;
          var node = entity.node,
              pos = entity.pos;
          eventObj.checkedNodes.push(node);
          eventObj.checkedNodesPositions.push({
            node: node,
            pos: pos
          });
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
              loadedKeys = _ref$loadedKeys === void 0 ? [] : _ref$loadedKeys,
              _ref$loadingKeys = _ref.loadingKeys,
              loadingKeys = _ref$loadingKeys === void 0 ? [] : _ref$loadingKeys;
          var _this$props3 = _this.props,
              loadData = _this$props3.loadData,
              onLoad = _this$props3.onLoad;
          var eventKey = treeNode.props.eventKey;

          if (!loadData || loadedKeys.indexOf(eventKey) !== -1 || loadingKeys.indexOf(eventKey) !== -1) {
            // react 15 will warn if return null
            return {};
          } // Process load data


          var promise = loadData(treeNode);
          promise.then(function () {
            var _this$state3 = _this.state,
                currentLoadedKeys = _this$state3.loadedKeys,
                currentLoadingKeys = _this$state3.loadingKeys;
            var newLoadedKeys = (0, _util.arrAdd)(currentLoadedKeys, eventKey);
            var newLoadingKeys = (0, _util.arrDel)(currentLoadingKeys, eventKey); // onLoad should trigger before internal setState to avoid `loadData` trigger twice.
            // https://github.com/ant-design/ant-design/issues/12464

            if (onLoad) {
              onLoad(newLoadedKeys, {
                event: 'load',
                node: treeNode
              });
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
          expanded = _treeNode$props2.expanded; // Update selected keys

      var index = expandedKeys.indexOf(eventKey);
      var targetExpanded = !expanded;
      (0, _warning.default)(expanded && index !== -1 || !expanded && index === -1, 'Expand state not sync with index check');

      if (targetExpanded) {
        expandedKeys = (0, _util.arrAdd)(expandedKeys, eventKey);
      } else {
        expandedKeys = (0, _util.arrDel)(expandedKeys, eventKey);
      }

      _this.setUncontrolledState({
        expandedKeys: expandedKeys
      });

      if (onExpand) {
        onExpand(expandedKeys, {
          node: treeNode,
          expanded: targetExpanded,
          nativeEvent: e.nativeEvent
        });
      } // Async Load data


      if (targetExpanded && loadData) {
        var loadPromise = _this.onNodeLoad(treeNode);

        return loadPromise ? loadPromise.then(function () {
          // [Legacy] Refresh logic
          _this.setUncontrolledState({
            expandedKeys: expandedKeys
          });
        }) : null;
      }

      return null;
    };

    _this.onNodeMouseEnter = function (event, node) {
      var onMouseEnter = _this.props.onMouseEnter;

      if (onMouseEnter) {
        onMouseEnter({
          event: event,
          node: node
        });
      }
    };

    _this.onNodeMouseLeave = function (event, node) {
      var onMouseLeave = _this.props.onMouseLeave;

      if (onMouseLeave) {
        onMouseLeave({
          event: event,
          node: node
        });
      }
    };

    _this.onNodeContextMenu = function (event, node) {
      var onRightClick = _this.props.onRightClick;

      if (onRightClick) {
        event.preventDefault();
        onRightClick({
          event: event,
          node: node
        });
      }
    };
    /**
     * Only update the value which is not in props
     */


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
          checkedKeys = _this$state$checkedKe === void 0 ? [] : _this$state$checkedKe;
      return checkedKeys.indexOf(key) !== -1;
    };
    /**
     * [Legacy] Original logic use `key` as tracking clue.
     * We have to use `cloneElement` to pass `key`.
     */


    _this.renderTreeNode = function (child, index) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var _this$state4 = _this.state,
          keyEntities = _this$state4.keyEntities,
          _this$state4$expanded = _this$state4.expandedKeys,
          expandedKeys = _this$state4$expanded === void 0 ? [] : _this$state4$expanded,
          _this$state4$selected = _this$state4.selectedKeys,
          selectedKeys = _this$state4$selected === void 0 ? [] : _this$state4$selected,
          _this$state4$halfChec = _this$state4.halfCheckedKeys,
          halfCheckedKeys = _this$state4$halfChec === void 0 ? [] : _this$state4$halfChec,
          _this$state4$loadedKe = _this$state4.loadedKeys,
          loadedKeys = _this$state4$loadedKe === void 0 ? [] : _this$state4$loadedKe,
          _this$state4$loadingK = _this$state4.loadingKeys,
          loadingKeys = _this$state4$loadingK === void 0 ? [] : _this$state4$loadingK,
          dragOverNodeKey = _this$state4.dragOverNodeKey,
          dropPosition = _this$state4.dropPosition;
      var pos = (0, _util.getPosition)(level, index);
      var key = child.key || pos;

      if (!keyEntities[key]) {
        (0, _util.warnOnlyTreeNode)();
        return null;
      }

      return React.cloneElement(child, {
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

    return _this;
  }

  _createClass(Tree, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var treeNode = this.state.treeNode;
      var _this$props5 = this.props,
          prefixCls = _this$props5.prefixCls,
          className = _this$props5.className,
          focusable = _this$props5.focusable,
          style = _this$props5.style,
          showLine = _this$props5.showLine,
          _this$props5$tabIndex = _this$props5.tabIndex,
          tabIndex = _this$props5$tabIndex === void 0 ? 0 : _this$props5$tabIndex,
          selectable = _this$props5.selectable,
          showIcon = _this$props5.showIcon,
          icon = _this$props5.icon,
          switcherIcon = _this$props5.switcherIcon,
          draggable = _this$props5.draggable,
          checkable = _this$props5.checkable,
          checkStrictly = _this$props5.checkStrictly,
          disabled = _this$props5.disabled,
          motion = _this$props5.motion,
          loadData = _this$props5.loadData,
          filterTreeNode = _this$props5.filterTreeNode;
      var domProps = (0, _util.getDataAndAria)(this.props);

      if (focusable) {
        domProps.tabIndex = tabIndex;
      }

      return React.createElement(_contextTypes.TreeContext.Provider, {
        value: {
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
      }, React.createElement("ul", Object.assign({}, domProps, {
        className: (0, _classnames.default)(prefixCls, className, _defineProperty({}, "".concat(prefixCls, "-show-line"), showLine)),
        style: style,
        role: "tree",
        unselectable: "on"
      }), (0, _util.mapChildren)(treeNode, function (node, index) {
        return _this2.renderTreeNode(node, index);
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, prevState) {
      var prevProps = prevState.prevProps;
      var newState = {
        prevProps: props
      };

      function needSync(name) {
        return !prevProps && name in props || prevProps && prevProps[name] !== props[name];
      } // ================== Tree Node ==================


      var treeNode = null; // Check if `treeData` or `children` changed and save into the state.

      if (needSync('treeData')) {
        treeNode = (0, _util.convertDataToTree)(props.treeData);
      } else if (needSync('children')) {
        treeNode = (0, _toArray.default)(props.children);
      } // Tree support filter function which will break the tree structure in the vdm.
      // We cache the treeNodes in state so that we can return the treeNode in event trigger.


      if (treeNode) {
        newState.treeNode = treeNode; // Calculate the entities data for quick match

        var entitiesMap = (0, _util.convertTreeToEntities)(treeNode);
        newState.keyEntities = entitiesMap.keyEntities;
      }

      var keyEntities = newState.keyEntities || prevState.keyEntities; // ================ expandedKeys =================

      if (needSync('expandedKeys') || prevProps && needSync('autoExpandParent')) {
        newState.expandedKeys = props.autoExpandParent || !prevProps && props.defaultExpandParent ? (0, _util.conductExpandParent)(props.expandedKeys, keyEntities) : props.expandedKeys;
      } else if (!prevProps && props.defaultExpandAll) {
        newState.expandedKeys = Object.keys(keyEntities);
      } else if (!prevProps && props.defaultExpandedKeys) {
        newState.expandedKeys = props.autoExpandParent || props.defaultExpandParent ? (0, _util.conductExpandParent)(props.defaultExpandedKeys, keyEntities) : props.defaultExpandedKeys;
      } // ================ selectedKeys =================


      if (props.selectable) {
        if (needSync('selectedKeys')) {
          newState.selectedKeys = (0, _util.calcSelectedKeys)(props.selectedKeys, props);
        } else if (!prevProps && props.defaultSelectedKeys) {
          newState.selectedKeys = (0, _util.calcSelectedKeys)(props.defaultSelectedKeys, props);
        }
      } // ================= checkedKeys =================


      if (props.checkable) {
        var checkedKeyEntity;

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
              checkedKeys = _checkedKeyEntity$che === void 0 ? [] : _checkedKeyEntity$che,
              _checkedKeyEntity$hal = _checkedKeyEntity.halfCheckedKeys,
              halfCheckedKeys = _checkedKeyEntity$hal === void 0 ? [] : _checkedKeyEntity$hal;

          if (!props.checkStrictly) {
            var conductKeys = (0, _util.conductCheck)(checkedKeys, true, keyEntities);
            checkedKeys = conductKeys.checkedKeys;
            halfCheckedKeys = conductKeys.halfCheckedKeys;
          }

          newState.checkedKeys = checkedKeys;
          newState.halfCheckedKeys = halfCheckedKeys;
        }
      } // ================= loadedKeys ==================


      if (needSync('loadedKeys')) {
        newState.loadedKeys = props.loadedKeys;
      }

      return newState;
    }
  }]);

  return Tree;
}(React.Component);

Tree.propTypes = {
  prefixCls: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  children: _propTypes.default.any,
  treeData: _propTypes.default.array,
  showLine: _propTypes.default.bool,
  showIcon: _propTypes.default.bool,
  icon: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]),
  focusable: _propTypes.default.bool,
  selectable: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  multiple: _propTypes.default.bool,
  checkable: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.node]),
  checkStrictly: _propTypes.default.bool,
  draggable: _propTypes.default.bool,
  defaultExpandParent: _propTypes.default.bool,
  autoExpandParent: _propTypes.default.bool,
  defaultExpandAll: _propTypes.default.bool,
  defaultExpandedKeys: _propTypes.default.arrayOf(_propTypes.default.string),
  expandedKeys: _propTypes.default.arrayOf(_propTypes.default.string),
  defaultCheckedKeys: _propTypes.default.arrayOf(_propTypes.default.string),
  checkedKeys: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])), _propTypes.default.object]),
  defaultSelectedKeys: _propTypes.default.arrayOf(_propTypes.default.string),
  selectedKeys: _propTypes.default.arrayOf(_propTypes.default.string),
  onClick: _propTypes.default.func,
  onDoubleClick: _propTypes.default.func,
  onExpand: _propTypes.default.func,
  onCheck: _propTypes.default.func,
  onSelect: _propTypes.default.func,
  onLoad: _propTypes.default.func,
  loadData: _propTypes.default.func,
  loadedKeys: _propTypes.default.arrayOf(_propTypes.default.string),
  onMouseEnter: _propTypes.default.func,
  onMouseLeave: _propTypes.default.func,
  onRightClick: _propTypes.default.func,
  onDragStart: _propTypes.default.func,
  onDragEnter: _propTypes.default.func,
  onDragOver: _propTypes.default.func,
  onDragLeave: _propTypes.default.func,
  onDragEnd: _propTypes.default.func,
  onDrop: _propTypes.default.func,
  filterTreeNode: _propTypes.default.func,
  motion: _propTypes.default.object,
  switcherIcon: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func])
};
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
var _default = Tree;
exports.default = _default;