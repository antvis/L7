function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import Tree from 'rc-tree';
import { createRef } from '../util';
export var popupContextTypes = {
  onPopupKeyDown: PropTypes.func.isRequired,
  onTreeNodeSelect: PropTypes.func.isRequired,
  onTreeNodeCheck: PropTypes.func.isRequired
};

var BasePopup =
/*#__PURE__*/
function (_React$Component) {
  _inherits(BasePopup, _React$Component);

  function BasePopup(props) {
    var _this;

    _classCallCheck(this, BasePopup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BasePopup).call(this));

    _defineProperty(_assertThisInitialized(_this), "onTreeExpand", function (expandedKeyList) {
      var _this$props = _this.props,
          treeExpandedKeys = _this$props.treeExpandedKeys,
          onTreeExpand = _this$props.onTreeExpand,
          onTreeExpanded = _this$props.onTreeExpanded; // Set uncontrolled state

      if (!treeExpandedKeys) {
        _this.setState({
          expandedKeyList: expandedKeyList
        }, onTreeExpanded);
      }

      if (onTreeExpand) {
        onTreeExpand(expandedKeyList);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onLoad", function (loadedKeys) {
      _this.setState({
        loadedKeys: loadedKeys
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getTree", function () {
      return _this.treeRef.current;
    });

    _defineProperty(_assertThisInitialized(_this), "getLoadData", function () {
      var _this$props2 = _this.props,
          loadData = _this$props2.loadData,
          upperSearchValue = _this$props2.upperSearchValue;
      if (upperSearchValue) return null;
      return loadData;
    });

    _defineProperty(_assertThisInitialized(_this), "filterTreeNode", function (treeNode) {
      var _this$props3 = _this.props,
          upperSearchValue = _this$props3.upperSearchValue,
          treeNodeFilterProp = _this$props3.treeNodeFilterProp;
      var filterVal = treeNode.props[treeNodeFilterProp];

      if (typeof filterVal === 'string') {
        return upperSearchValue && filterVal.toUpperCase().indexOf(upperSearchValue) !== -1;
      }

      return false;
    });

    _defineProperty(_assertThisInitialized(_this), "renderNotFound", function () {
      var _this$props4 = _this.props,
          prefixCls = _this$props4.prefixCls,
          notFoundContent = _this$props4.notFoundContent;
      return React.createElement("span", {
        className: "".concat(prefixCls, "-not-found")
      }, notFoundContent);
    });

    var treeDefaultExpandAll = props.treeDefaultExpandAll,
        treeDefaultExpandedKeys = props.treeDefaultExpandedKeys,
        keyEntities = props.keyEntities; // TODO: make `expandedKeyList` control

    var _expandedKeyList = treeDefaultExpandedKeys;

    if (treeDefaultExpandAll) {
      _expandedKeyList = Object.keys(keyEntities);
    }

    _this.state = {
      keyList: [],
      expandedKeyList: _expandedKeyList,
      // Cache `expandedKeyList` when tree is in filter. This is used in `getDerivedStateFromProps`
      cachedExpandedKeyList: [],
      // eslint-disable-line react/no-unused-state
      loadedKeys: []
    };
    _this.treeRef = createRef();
    return _this;
  }

  _createClass(BasePopup, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
          keyList = _this$state.keyList,
          expandedKeyList = _this$state.expandedKeyList,
          loadedKeys = _this$state.loadedKeys;
      var _this$props5 = this.props,
          prefixCls = _this$props5.prefixCls,
          treeNodes = _this$props5.treeNodes,
          filteredTreeNodes = _this$props5.filteredTreeNodes,
          treeIcon = _this$props5.treeIcon,
          treeLine = _this$props5.treeLine,
          treeCheckable = _this$props5.treeCheckable,
          treeCheckStrictly = _this$props5.treeCheckStrictly,
          multiple = _this$props5.multiple,
          ariaId = _this$props5.ariaId,
          renderSearch = _this$props5.renderSearch,
          switcherIcon = _this$props5.switcherIcon,
          searchHalfCheckedKeys = _this$props5.searchHalfCheckedKeys;
      var _this$context$rcTreeS = this.context.rcTreeSelect,
          onPopupKeyDown = _this$context$rcTreeS.onPopupKeyDown,
          onTreeNodeSelect = _this$context$rcTreeS.onTreeNodeSelect,
          onTreeNodeCheck = _this$context$rcTreeS.onTreeNodeCheck;
      var loadData = this.getLoadData();
      var treeProps = {};

      if (treeCheckable) {
        treeProps.checkedKeys = keyList;
      } else {
        treeProps.selectedKeys = keyList;
      }

      var $notFound;
      var $treeNodes;

      if (filteredTreeNodes) {
        if (filteredTreeNodes.length) {
          treeProps.checkStrictly = true;
          $treeNodes = filteredTreeNodes; // Fill halfCheckedKeys

          if (treeCheckable && !treeCheckStrictly) {
            treeProps.checkedKeys = {
              checked: keyList,
              halfChecked: searchHalfCheckedKeys
            };
          }
        } else {
          $notFound = this.renderNotFound();
        }
      } else if (!treeNodes || !treeNodes.length) {
        $notFound = this.renderNotFound();
      } else {
        $treeNodes = treeNodes;
      }

      var $tree;

      if ($notFound) {
        $tree = $notFound;
      } else {
        $tree = React.createElement(Tree, _extends({
          ref: this.treeRef,
          prefixCls: "".concat(prefixCls, "-tree"),
          showIcon: treeIcon,
          showLine: treeLine,
          selectable: !treeCheckable,
          checkable: treeCheckable,
          checkStrictly: treeCheckStrictly,
          multiple: multiple,
          loadData: loadData,
          loadedKeys: loadedKeys,
          expandedKeys: expandedKeyList,
          filterTreeNode: this.filterTreeNode,
          onSelect: onTreeNodeSelect,
          onCheck: onTreeNodeCheck,
          onExpand: this.onTreeExpand,
          onLoad: this.onLoad,
          switcherIcon: switcherIcon
        }, treeProps), $treeNodes);
      }

      return React.createElement("div", {
        role: "listbox",
        id: ariaId,
        onKeyDown: onPopupKeyDown,
        tabIndex: -1
      }, renderSearch ? renderSearch() : null, $tree);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var _ref = prevState || {},
          _ref$prevProps = _ref.prevProps,
          prevProps = _ref$prevProps === void 0 ? {} : _ref$prevProps,
          loadedKeys = _ref.loadedKeys,
          expandedKeyList = _ref.expandedKeyList,
          cachedExpandedKeyList = _ref.cachedExpandedKeyList;

      var valueList = nextProps.valueList,
          valueEntities = nextProps.valueEntities,
          keyEntities = nextProps.keyEntities,
          treeExpandedKeys = nextProps.treeExpandedKeys,
          filteredTreeNodes = nextProps.filteredTreeNodes,
          upperSearchValue = nextProps.upperSearchValue;
      var newState = {
        prevProps: nextProps
      }; // Check value update

      if (valueList !== prevProps.valueList) {
        newState.keyList = valueList.map(function (_ref2) {
          var value = _ref2.value;
          return valueEntities[value];
        }).filter(function (entity) {
          return entity;
        }).map(function (_ref3) {
          var key = _ref3.key;
          return key;
        });
      } // Show all when tree is in filter mode


      if (!treeExpandedKeys && filteredTreeNodes && filteredTreeNodes.length && filteredTreeNodes !== prevProps.filteredTreeNodes) {
        newState.expandedKeyList = Object.keys(keyEntities);
      } // Cache `expandedKeyList` when filter set


      if (upperSearchValue && !prevProps.upperSearchValue) {
        newState.cachedExpandedKeyList = expandedKeyList;
      } else if (!upperSearchValue && prevProps.upperSearchValue && !treeExpandedKeys) {
        newState.expandedKeyList = cachedExpandedKeyList || [];
        newState.cachedExpandedKeyList = [];
      } // Use expandedKeys if provided


      if (prevProps.treeExpandedKeys !== treeExpandedKeys) {
        newState.expandedKeyList = treeExpandedKeys;
      } // Clean loadedKeys if key not exist in keyEntities anymore


      if (nextProps.loadData) {
        newState.loadedKeys = loadedKeys.filter(function (key) {
          return key in keyEntities;
        });
      }

      return newState;
    }
  }]);

  return BasePopup;
}(React.Component);

_defineProperty(BasePopup, "propTypes", {
  prefixCls: PropTypes.string,
  upperSearchValue: PropTypes.string,
  valueList: PropTypes.array,
  searchHalfCheckedKeys: PropTypes.array,
  valueEntities: PropTypes.object,
  keyEntities: PropTypes.object,
  treeIcon: PropTypes.bool,
  treeLine: PropTypes.bool,
  treeNodeFilterProp: PropTypes.string,
  treeCheckable: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  treeCheckStrictly: PropTypes.bool,
  treeDefaultExpandAll: PropTypes.bool,
  treeDefaultExpandedKeys: PropTypes.array,
  treeExpandedKeys: PropTypes.array,
  loadData: PropTypes.func,
  multiple: PropTypes.bool,
  onTreeExpand: PropTypes.func,
  treeNodes: PropTypes.node,
  filteredTreeNodes: PropTypes.node,
  notFoundContent: PropTypes.node,
  ariaId: PropTypes.string,
  switcherIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  // HOC
  renderSearch: PropTypes.func,
  onTreeExpanded: PropTypes.func
});

_defineProperty(BasePopup, "contextTypes", {
  rcTreeSelect: PropTypes.shape(_objectSpread({}, popupContextTypes))
});

polyfill(BasePopup);
export default BasePopup;