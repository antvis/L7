function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import omit from 'omit.js';
import classNames from 'classnames';
import PureRenderMixin from "rc-util/es/PureRenderMixin";
import Checkbox from '../checkbox';
import Search from './search';
import defaultRenderList, { OmitProps } from './renderListBody';
import triggerEvent from '../_util/triggerEvent';

var defaultRender = function defaultRender() {
  return null;
};

function isRenderResultPlainObject(result) {
  return result && !React.isValidElement(result) && Object.prototype.toString.call(result) === '[object Object]';
}

function renderListNode(renderList, props) {
  var bodyContent = renderList ? renderList(props) : null;
  var customize = !!bodyContent;

  if (!customize) {
    bodyContent = defaultRenderList(props);
  }

  return {
    customize: customize,
    bodyContent: bodyContent
  };
}

var TransferList =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TransferList, _React$Component);

  function TransferList(props) {
    var _this;

    _classCallCheck(this, TransferList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TransferList).call(this, props));

    _this.handleFilter = function (e) {
      var handleFilter = _this.props.handleFilter;
      var filterValue = e.target.value;

      _this.setState({
        filterValue: filterValue
      });

      handleFilter(e);

      if (!filterValue) {
        return;
      } // Manually trigger scroll event for lazy search bug
      // https://github.com/ant-design/ant-design/issues/5631


      _this.triggerScrollTimer = window.setTimeout(function () {
        var transferNode = ReactDOM.findDOMNode(_assertThisInitialized(_this));
        var listNode = transferNode.querySelectorAll('.ant-transfer-list-content')[0];

        if (listNode) {
          triggerEvent(listNode, 'scroll');
        }
      }, 0);
    };

    _this.handleClear = function () {
      var handleClear = _this.props.handleClear;

      _this.setState({
        filterValue: ''
      });

      handleClear();
    };

    _this.matchFilter = function (text, item) {
      var filterValue = _this.state.filterValue;
      var filterOption = _this.props.filterOption;

      if (filterOption) {
        return filterOption(filterValue, item);
      }

      return text.indexOf(filterValue) >= 0;
    };

    _this.renderItem = function (item) {
      var _this$props$render = _this.props.render,
          render = _this$props$render === void 0 ? defaultRender : _this$props$render;
      var renderResult = render(item);
      var isRenderResultPlain = isRenderResultPlainObject(renderResult);
      return {
        renderedText: isRenderResultPlain ? renderResult.value : renderResult,
        renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
        item: item
      };
    };

    _this.state = {
      filterValue: ''
    };
    return _this;
  }

  _createClass(TransferList, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return PureRenderMixin.shouldComponentUpdate.apply(this, args);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this.triggerScrollTimer);
    }
  }, {
    key: "getCheckStatus",
    value: function getCheckStatus(filteredItems) {
      var checkedKeys = this.props.checkedKeys;

      if (checkedKeys.length === 0) {
        return 'none';
      }

      if (filteredItems.every(function (item) {
        return checkedKeys.indexOf(item.key) >= 0 || !!item.disabled;
      })) {
        return 'all';
      }

      return 'part';
    }
  }, {
    key: "getFilteredItems",
    value: function getFilteredItems(dataSource, filterValue) {
      var _this2 = this;

      var filteredItems = [];
      var filteredRenderItems = [];
      dataSource.forEach(function (item) {
        var renderedItem = _this2.renderItem(item);

        var renderedText = renderedItem.renderedText; // Filter skip

        if (filterValue && filterValue.trim() && !_this2.matchFilter(renderedText, item)) {
          return null;
        }

        filteredItems.push(item);
        filteredRenderItems.push(renderedItem);
      });
      return {
        filteredItems: filteredItems,
        filteredRenderItems: filteredRenderItems
      };
    }
  }, {
    key: "getListBody",
    value: function getListBody(prefixCls, searchPlaceholder, filterValue, filteredItems, notFoundContent, bodyDom, filteredRenderItems, checkedKeys, renderList, showSearch, disabled) {
      var search = showSearch ? React.createElement("div", {
        className: "".concat(prefixCls, "-body-search-wrapper")
      }, React.createElement(Search, {
        prefixCls: "".concat(prefixCls, "-search"),
        onChange: this.handleFilter,
        handleClear: this.handleClear,
        placeholder: searchPlaceholder,
        value: filterValue,
        disabled: disabled
      })) : null;
      var listBody = bodyDom;

      if (!listBody) {
        var bodyNode;

        var _renderListNode = renderListNode(renderList, _extends(_extends({}, omit(this.props, OmitProps)), {
          filteredItems: filteredItems,
          filteredRenderItems: filteredRenderItems,
          selectedKeys: checkedKeys
        })),
            bodyContent = _renderListNode.bodyContent,
            customize = _renderListNode.customize; // We should wrap customize list body in a classNamed div to use flex layout.


        if (customize) {
          bodyNode = React.createElement("div", {
            className: "".concat(prefixCls, "-body-customize-wrapper")
          }, bodyContent);
        } else {
          bodyNode = filteredItems.length ? bodyContent : React.createElement("div", {
            className: "".concat(prefixCls, "-body-not-found")
          }, notFoundContent);
        }

        listBody = React.createElement("div", {
          className: classNames(showSearch ? "".concat(prefixCls, "-body ").concat(prefixCls, "-body-with-search") : "".concat(prefixCls, "-body"))
        }, search, bodyNode);
      }

      return listBody;
    }
  }, {
    key: "getCheckBox",
    value: function getCheckBox(filteredItems, onItemSelectAll, showSelectAll, disabled) {
      var checkStatus = this.getCheckStatus(filteredItems);
      var checkedAll = checkStatus === 'all';
      var checkAllCheckbox = showSelectAll !== false && React.createElement(Checkbox, {
        disabled: disabled,
        checked: checkedAll,
        indeterminate: checkStatus === 'part',
        onChange: function onChange() {
          // Only select enabled items
          onItemSelectAll(filteredItems.filter(function (item) {
            return !item.disabled;
          }).map(function (_ref) {
            var key = _ref.key;
            return key;
          }), !checkedAll);
        }
      });
      return checkAllCheckbox;
    }
  }, {
    key: "render",
    value: function render() {
      var filterValue = this.state.filterValue;
      var _this$props = this.props,
          prefixCls = _this$props.prefixCls,
          dataSource = _this$props.dataSource,
          titleText = _this$props.titleText,
          checkedKeys = _this$props.checkedKeys,
          disabled = _this$props.disabled,
          body = _this$props.body,
          footer = _this$props.footer,
          showSearch = _this$props.showSearch,
          style = _this$props.style,
          searchPlaceholder = _this$props.searchPlaceholder,
          notFoundContent = _this$props.notFoundContent,
          itemUnit = _this$props.itemUnit,
          itemsUnit = _this$props.itemsUnit,
          renderList = _this$props.renderList,
          onItemSelectAll = _this$props.onItemSelectAll,
          showSelectAll = _this$props.showSelectAll; // Custom Layout

      var footerDom = footer && footer(this.props);
      var bodyDom = body && body(this.props);
      var listCls = classNames(prefixCls, _defineProperty({}, "".concat(prefixCls, "-with-footer"), !!footerDom)); // ====================== Get filtered, checked item list ======================

      var _this$getFilteredItem = this.getFilteredItems(dataSource, filterValue),
          filteredItems = _this$getFilteredItem.filteredItems,
          filteredRenderItems = _this$getFilteredItem.filteredRenderItems; // ================================= List Body =================================


      var unit = dataSource.length > 1 ? itemsUnit : itemUnit;
      var listBody = this.getListBody(prefixCls, searchPlaceholder, filterValue, filteredItems, notFoundContent, bodyDom, filteredRenderItems, checkedKeys, renderList, showSearch, disabled); // ================================ List Footer ================================

      var listFooter = footerDom ? React.createElement("div", {
        className: "".concat(prefixCls, "-footer")
      }, footerDom) : null;
      var checkAllCheckbox = this.getCheckBox(filteredItems, onItemSelectAll, showSelectAll, disabled); // ================================== Render ===================================

      return React.createElement("div", {
        className: listCls,
        style: style
      }, React.createElement("div", {
        className: "".concat(prefixCls, "-header")
      }, checkAllCheckbox, React.createElement("span", {
        className: "".concat(prefixCls, "-header-selected")
      }, React.createElement("span", null, (checkedKeys.length > 0 ? "".concat(checkedKeys.length, "/") : '') + filteredItems.length, ' ', unit), React.createElement("span", {
        className: "".concat(prefixCls, "-header-title")
      }, titleText))), listBody, listFooter);
    }
  }]);

  return TransferList;
}(React.Component);

export { TransferList as default };
TransferList.defaultProps = {
  dataSource: [],
  titleText: '',
  showSearch: false,
  lazy: {}
};
//# sourceMappingURL=list.js.map
