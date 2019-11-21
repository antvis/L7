function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

import * as React from 'react';
import RcTreeSelect, { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from 'rc-tree-select';
import classNames from 'classnames';
import omit from 'omit.js';
import { ConfigConsumer } from '../config-provider';
import warning from '../_util/warning';
import { cloneElement } from '../_util/reactNode';
import Icon from '../icon';

var TreeSelect =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TreeSelect, _React$Component);

  function TreeSelect(props) {
    var _this;

    _classCallCheck(this, TreeSelect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TreeSelect).call(this, props));

    _this.saveTreeSelect = function (node) {
      _this.rcTreeSelect = node;
    };

    _this.renderSwitcherIcon = function (prefixCls, _ref) {
      var isLeaf = _ref.isLeaf,
          loading = _ref.loading;

      if (loading) {
        return React.createElement(Icon, {
          type: "loading",
          className: "".concat(prefixCls, "-switcher-loading-icon")
        });
      }

      if (isLeaf) {
        return null;
      }

      return React.createElement(Icon, {
        type: "caret-down",
        className: "".concat(prefixCls, "-switcher-icon")
      });
    };

    _this.renderTreeSelect = function (_ref2) {
      var _classNames;

      var getContextPopupContainer = _ref2.getPopupContainer,
          getPrefixCls = _ref2.getPrefixCls,
          renderEmpty = _ref2.renderEmpty;

      var _a = _this.props,
          customizePrefixCls = _a.prefixCls,
          className = _a.className,
          size = _a.size,
          notFoundContent = _a.notFoundContent,
          dropdownStyle = _a.dropdownStyle,
          dropdownClassName = _a.dropdownClassName,
          suffixIcon = _a.suffixIcon,
          removeIcon = _a.removeIcon,
          clearIcon = _a.clearIcon,
          getPopupContainer = _a.getPopupContainer,
          restProps = __rest(_a, ["prefixCls", "className", "size", "notFoundContent", "dropdownStyle", "dropdownClassName", "suffixIcon", "removeIcon", "clearIcon", "getPopupContainer"]);

      var rest = omit(restProps, ['inputIcon', 'removeIcon', 'clearIcon', 'switcherIcon']);
      var prefixCls = getPrefixCls('select', customizePrefixCls);
      var cls = classNames((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-lg"), size === 'large'), _defineProperty(_classNames, "".concat(prefixCls, "-sm"), size === 'small'), _classNames), className); // showSearch: single - false, multiple - true

      var showSearch = restProps.showSearch;

      if (!('showSearch' in restProps)) {
        showSearch = !!(restProps.multiple || restProps.treeCheckable);
      }

      var checkable = rest.treeCheckable;

      if (checkable) {
        checkable = React.createElement("span", {
          className: "".concat(prefixCls, "-tree-checkbox-inner")
        });
      }

      var inputIcon = suffixIcon ? cloneElement(suffixIcon) : React.createElement(Icon, {
        type: "down",
        className: "".concat(prefixCls, "-arrow-icon")
      });
      var finalRemoveIcon = removeIcon ? cloneElement(removeIcon) : React.createElement(Icon, {
        type: "close",
        className: "".concat(prefixCls, "-remove-icon")
      });
      var finalClearIcon = clearIcon ? cloneElement(clearIcon) : React.createElement(Icon, {
        type: "close-circle",
        theme: "filled",
        className: "".concat(prefixCls, "-clear-icon")
      });
      return React.createElement(RcTreeSelect, _extends({
        switcherIcon: function switcherIcon(nodeProps) {
          return _this.renderSwitcherIcon(prefixCls, nodeProps);
        },
        inputIcon: inputIcon,
        removeIcon: finalRemoveIcon,
        clearIcon: finalClearIcon
      }, rest, {
        showSearch: showSearch,
        getPopupContainer: getPopupContainer || getContextPopupContainer,
        dropdownClassName: classNames(dropdownClassName, "".concat(prefixCls, "-tree-dropdown")),
        prefixCls: prefixCls,
        className: cls,
        dropdownStyle: _extends({
          maxHeight: '100vh',
          overflow: 'auto'
        }, dropdownStyle),
        treeCheckable: checkable,
        notFoundContent: notFoundContent || renderEmpty('Select'),
        ref: _this.saveTreeSelect
      }));
    };

    warning(props.multiple !== false || !props.treeCheckable, 'TreeSelect', '`multiple` will alway be `true` when `treeCheckable` is true');
    return _this;
  }

  _createClass(TreeSelect, [{
    key: "focus",
    value: function focus() {
      this.rcTreeSelect.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.rcTreeSelect.blur();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(ConfigConsumer, null, this.renderTreeSelect);
    }
  }]);

  return TreeSelect;
}(React.Component);

export { TreeSelect as default };
TreeSelect.TreeNode = TreeNode;
TreeSelect.SHOW_ALL = SHOW_ALL;
TreeSelect.SHOW_PARENT = SHOW_PARENT;
TreeSelect.SHOW_CHILD = SHOW_CHILD;
TreeSelect.defaultProps = {
  transitionName: 'slide-up',
  choiceTransitionName: 'zoom'
};
//# sourceMappingURL=index.js.map
