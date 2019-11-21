"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var PropTypes = _interopRequireWildcard(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _list = _interopRequireDefault(require("./list"));

var _operation = _interopRequireDefault(require("./operation"));

var _search = _interopRequireDefault(require("./search"));

var _warning = _interopRequireDefault(require("../_util/warning"));

var _LocaleReceiver = _interopRequireDefault(require("../locale-provider/LocaleReceiver"));

var _default2 = _interopRequireDefault(require("../locale/default"));

var _configProvider = require("../config-provider");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Transfer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Transfer, _React$Component);

  function Transfer(props) {
    var _this;

    _classCallCheck(this, Transfer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Transfer).call(this, props));
    _this.separatedDataSource = null;

    _this.getLocale = function (transferLocale, renderEmpty) {
      // Keep old locale props still working.
      var oldLocale = {
        notFoundContent: renderEmpty('Transfer')
      };

      if ('notFoundContent' in _this.props) {
        oldLocale.notFoundContent = _this.props.notFoundContent;
      }

      if ('searchPlaceholder' in _this.props) {
        oldLocale.searchPlaceholder = _this.props.searchPlaceholder;
      }

      return _extends(_extends(_extends({}, transferLocale), oldLocale), _this.props.locale);
    };

    _this.moveTo = function (direction) {
      var _this$props = _this.props,
          _this$props$targetKey = _this$props.targetKeys,
          targetKeys = _this$props$targetKey === void 0 ? [] : _this$props$targetKey,
          _this$props$dataSourc = _this$props.dataSource,
          dataSource = _this$props$dataSourc === void 0 ? [] : _this$props$dataSourc,
          onChange = _this$props.onChange;
      var _this$state = _this.state,
          sourceSelectedKeys = _this$state.sourceSelectedKeys,
          targetSelectedKeys = _this$state.targetSelectedKeys;
      var moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys; // filter the disabled options

      var newMoveKeys = moveKeys.filter(function (key) {
        return !dataSource.some(function (data) {
          return !!(key === data.key && data.disabled);
        });
      }); // move items to target box

      var newTargetKeys = direction === 'right' ? newMoveKeys.concat(targetKeys) : targetKeys.filter(function (targetKey) {
        return newMoveKeys.indexOf(targetKey) === -1;
      }); // empty checked keys

      var oppositeDirection = direction === 'right' ? 'left' : 'right';

      _this.setState(_defineProperty({}, _this.getSelectedKeysName(oppositeDirection), []));

      _this.handleSelectChange(oppositeDirection, []);

      if (onChange) {
        onChange(newTargetKeys, direction, newMoveKeys);
      }
    };

    _this.moveToLeft = function () {
      return _this.moveTo('left');
    };

    _this.moveToRight = function () {
      return _this.moveTo('right');
    };

    _this.onItemSelectAll = function (direction, selectedKeys, checkAll) {
      var originalSelectedKeys = _this.state[_this.getSelectedKeysName(direction)] || [];
      var mergedCheckedKeys = [];

      if (checkAll) {
        // Merge current keys with origin key
        mergedCheckedKeys = Array.from(new Set([].concat(_toConsumableArray(originalSelectedKeys), _toConsumableArray(selectedKeys))));
      } else {
        // Remove current keys from origin keys
        mergedCheckedKeys = originalSelectedKeys.filter(function (key) {
          return selectedKeys.indexOf(key) === -1;
        });
      }

      _this.handleSelectChange(direction, mergedCheckedKeys);

      if (!_this.props.selectedKeys) {
        _this.setState(_defineProperty({}, _this.getSelectedKeysName(direction), mergedCheckedKeys));
      }
    };

    _this.handleSelectAll = function (direction, filteredDataSource, checkAll) {
      (0, _warning["default"])(false, 'Transfer', '`handleSelectAll` will be removed, please use `onSelectAll` instead.');

      _this.onItemSelectAll(direction, filteredDataSource.map(function (_ref) {
        var key = _ref.key;
        return key;
      }), !checkAll);
    }; // [Legacy] Old prop `body` pass origin check as arg. It's confusing.
    // TODO: Remove this in next version.


    _this.handleLeftSelectAll = function (filteredDataSource, checkAll) {
      return _this.handleSelectAll('left', filteredDataSource, !checkAll);
    };

    _this.handleRightSelectAll = function (filteredDataSource, checkAll) {
      return _this.handleSelectAll('right', filteredDataSource, !checkAll);
    };

    _this.onLeftItemSelectAll = function (selectedKeys, checkAll) {
      return _this.onItemSelectAll('left', selectedKeys, checkAll);
    };

    _this.onRightItemSelectAll = function (selectedKeys, checkAll) {
      return _this.onItemSelectAll('right', selectedKeys, checkAll);
    };

    _this.handleFilter = function (direction, e) {
      var _this$props2 = _this.props,
          onSearchChange = _this$props2.onSearchChange,
          onSearch = _this$props2.onSearch;
      var value = e.target.value;

      if (onSearchChange) {
        (0, _warning["default"])(false, 'Transfer', '`onSearchChange` is deprecated. Please use `onSearch` instead.');
        onSearchChange(direction, e);
      }

      if (onSearch) {
        onSearch(direction, value);
      }
    };

    _this.handleLeftFilter = function (e) {
      return _this.handleFilter('left', e);
    };

    _this.handleRightFilter = function (e) {
      return _this.handleFilter('right', e);
    };

    _this.handleClear = function (direction) {
      var onSearch = _this.props.onSearch;

      if (onSearch) {
        onSearch(direction, '');
      }
    };

    _this.handleLeftClear = function () {
      return _this.handleClear('left');
    };

    _this.handleRightClear = function () {
      return _this.handleClear('right');
    };

    _this.onItemSelect = function (direction, selectedKey, checked) {
      var _this$state2 = _this.state,
          sourceSelectedKeys = _this$state2.sourceSelectedKeys,
          targetSelectedKeys = _this$state2.targetSelectedKeys;
      var holder = direction === 'left' ? _toConsumableArray(sourceSelectedKeys) : _toConsumableArray(targetSelectedKeys);
      var index = holder.indexOf(selectedKey);

      if (index > -1) {
        holder.splice(index, 1);
      }

      if (checked) {
        holder.push(selectedKey);
      }

      _this.handleSelectChange(direction, holder);

      if (!_this.props.selectedKeys) {
        _this.setState(_defineProperty({}, _this.getSelectedKeysName(direction), holder));
      }
    };

    _this.handleSelect = function (direction, selectedItem, checked) {
      (0, _warning["default"])(false, 'Transfer', '`handleSelect` will be removed, please use `onSelect` instead.');

      _this.onItemSelect(direction, selectedItem.key, checked);
    };

    _this.handleLeftSelect = function (selectedItem, checked) {
      return _this.handleSelect('left', selectedItem, checked);
    };

    _this.handleRightSelect = function (selectedItem, checked) {
      return _this.handleSelect('right', selectedItem, checked);
    };

    _this.onLeftItemSelect = function (selectedKey, checked) {
      return _this.onItemSelect('left', selectedKey, checked);
    };

    _this.onRightItemSelect = function (selectedKey, checked) {
      return _this.onItemSelect('right', selectedKey, checked);
    };

    _this.handleScroll = function (direction, e) {
      var onScroll = _this.props.onScroll;

      if (onScroll) {
        onScroll(direction, e);
      }
    };

    _this.handleLeftScroll = function (e) {
      return _this.handleScroll('left', e);
    };

    _this.handleRightScroll = function (e) {
      return _this.handleScroll('right', e);
    };

    _this.handleListStyle = function (listStyle, direction) {
      if (typeof listStyle === 'function') {
        return listStyle({
          direction: direction
        });
      }

      return listStyle;
    };

    _this.renderTransfer = function (transferLocale) {
      return React.createElement(_configProvider.ConfigConsumer, null, function (_ref2) {
        var _classNames;

        var getPrefixCls = _ref2.getPrefixCls,
            renderEmpty = _ref2.renderEmpty;
        var _this$props3 = _this.props,
            customizePrefixCls = _this$props3.prefixCls,
            className = _this$props3.className,
            disabled = _this$props3.disabled,
            _this$props3$operatio = _this$props3.operations,
            operations = _this$props3$operatio === void 0 ? [] : _this$props3$operatio,
            showSearch = _this$props3.showSearch,
            body = _this$props3.body,
            footer = _this$props3.footer,
            style = _this$props3.style,
            listStyle = _this$props3.listStyle,
            operationStyle = _this$props3.operationStyle,
            filterOption = _this$props3.filterOption,
            render = _this$props3.render,
            lazy = _this$props3.lazy,
            children = _this$props3.children,
            showSelectAll = _this$props3.showSelectAll;
        var prefixCls = getPrefixCls('transfer', customizePrefixCls);

        var locale = _this.getLocale(transferLocale, renderEmpty);

        var _this$state3 = _this.state,
            sourceSelectedKeys = _this$state3.sourceSelectedKeys,
            targetSelectedKeys = _this$state3.targetSelectedKeys;

        var _this$separateDataSou = _this.separateDataSource(),
            leftDataSource = _this$separateDataSou.leftDataSource,
            rightDataSource = _this$separateDataSou.rightDataSource;

        var leftActive = targetSelectedKeys.length > 0;
        var rightActive = sourceSelectedKeys.length > 0;
        var cls = (0, _classnames["default"])(className, prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-disabled"), disabled), _defineProperty(_classNames, "".concat(prefixCls, "-customize-list"), !!children), _classNames));

        var titles = _this.getTitles(locale);

        return React.createElement("div", {
          className: cls,
          style: style
        }, React.createElement(_list["default"], _extends({
          prefixCls: "".concat(prefixCls, "-list"),
          titleText: titles[0],
          dataSource: leftDataSource,
          filterOption: filterOption,
          style: _this.handleListStyle(listStyle, 'left'),
          checkedKeys: sourceSelectedKeys,
          handleFilter: _this.handleLeftFilter,
          handleClear: _this.handleLeftClear,
          handleSelect: _this.handleLeftSelect,
          handleSelectAll: _this.handleLeftSelectAll,
          onItemSelect: _this.onLeftItemSelect,
          onItemSelectAll: _this.onLeftItemSelectAll,
          render: render,
          showSearch: showSearch,
          body: body,
          renderList: children,
          footer: footer,
          lazy: lazy,
          onScroll: _this.handleLeftScroll,
          disabled: disabled,
          direction: "left",
          showSelectAll: showSelectAll
        }, locale)), React.createElement(_operation["default"], {
          className: "".concat(prefixCls, "-operation"),
          rightActive: rightActive,
          rightArrowText: operations[0],
          moveToRight: _this.moveToRight,
          leftActive: leftActive,
          leftArrowText: operations[1],
          moveToLeft: _this.moveToLeft,
          style: operationStyle,
          disabled: disabled
        }), React.createElement(_list["default"], _extends({
          prefixCls: "".concat(prefixCls, "-list"),
          titleText: titles[1],
          dataSource: rightDataSource,
          filterOption: filterOption,
          style: _this.handleListStyle(listStyle, 'right'),
          checkedKeys: targetSelectedKeys,
          handleFilter: _this.handleRightFilter,
          handleClear: _this.handleRightClear,
          handleSelect: _this.handleRightSelect,
          handleSelectAll: _this.handleRightSelectAll,
          onItemSelect: _this.onRightItemSelect,
          onItemSelectAll: _this.onRightItemSelectAll,
          render: render,
          showSearch: showSearch,
          body: body,
          renderList: children,
          footer: footer,
          lazy: lazy,
          onScroll: _this.handleRightScroll,
          disabled: disabled,
          direction: "right",
          showSelectAll: showSelectAll
        }, locale)));
      });
    };

    (0, _warning["default"])(!('notFoundContent' in props || 'searchPlaceholder' in props), 'Transfer', '`notFoundContent` and `searchPlaceholder` will be removed, ' + 'please use `locale` instead.');
    (0, _warning["default"])(!('body' in props), 'Transfer', '`body` is internal usage and will bre removed, please use `children` instead.');
    var _props$selectedKeys = props.selectedKeys,
        selectedKeys = _props$selectedKeys === void 0 ? [] : _props$selectedKeys,
        _props$targetKeys = props.targetKeys,
        targetKeys = _props$targetKeys === void 0 ? [] : _props$targetKeys;
    _this.state = {
      sourceSelectedKeys: selectedKeys.filter(function (key) {
        return targetKeys.indexOf(key) === -1;
      }),
      targetSelectedKeys: selectedKeys.filter(function (key) {
        return targetKeys.indexOf(key) > -1;
      })
    };
    return _this;
  }

  _createClass(Transfer, [{
    key: "getSelectedKeysName",
    // eslint-disable-next-line
    value: function getSelectedKeysName(direction) {
      return direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys';
    }
  }, {
    key: "getTitles",
    value: function getTitles(transferLocale) {
      var props = this.props;

      if (props.titles) {
        return props.titles;
      }

      return transferLocale.titles;
    }
  }, {
    key: "handleSelectChange",
    value: function handleSelectChange(direction, holder) {
      var _this$state4 = this.state,
          sourceSelectedKeys = _this$state4.sourceSelectedKeys,
          targetSelectedKeys = _this$state4.targetSelectedKeys;
      var onSelectChange = this.props.onSelectChange;

      if (!onSelectChange) {
        return;
      }

      if (direction === 'left') {
        onSelectChange(holder, targetSelectedKeys);
      } else {
        onSelectChange(sourceSelectedKeys, holder);
      }
    }
  }, {
    key: "separateDataSource",
    value: function separateDataSource() {
      var _this$props4 = this.props,
          dataSource = _this$props4.dataSource,
          rowKey = _this$props4.rowKey,
          _this$props4$targetKe = _this$props4.targetKeys,
          targetKeys = _this$props4$targetKe === void 0 ? [] : _this$props4$targetKe;
      var leftDataSource = [];
      var rightDataSource = new Array(targetKeys.length);
      dataSource.forEach(function (record) {
        if (rowKey) {
          record.key = rowKey(record);
        } // rightDataSource should be ordered by targetKeys
        // leftDataSource should be ordered by dataSource


        var indexOfKey = targetKeys.indexOf(record.key);

        if (indexOfKey !== -1) {
          rightDataSource[indexOfKey] = record;
        } else {
          leftDataSource.push(record);
        }
      });
      return {
        leftDataSource: leftDataSource,
        rightDataSource: rightDataSource
      };
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_LocaleReceiver["default"], {
        componentName: "Transfer",
        defaultLocale: _default2["default"].Transfer
      }, this.renderTransfer);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps) {
      if (nextProps.selectedKeys) {
        var targetKeys = nextProps.targetKeys || [];
        return {
          sourceSelectedKeys: nextProps.selectedKeys.filter(function (key) {
            return !targetKeys.includes(key);
          }),
          targetSelectedKeys: nextProps.selectedKeys.filter(function (key) {
            return targetKeys.includes(key);
          })
        };
      }

      return null;
    }
  }]);

  return Transfer;
}(React.Component); // For high-level customized Transfer @dqaria


Transfer.List = _list["default"];
Transfer.Operation = _operation["default"];
Transfer.Search = _search["default"];
Transfer.defaultProps = {
  dataSource: [],
  locale: {},
  showSearch: false,
  listStyle: function listStyle() {}
};
Transfer.propTypes = {
  prefixCls: PropTypes.string,
  disabled: PropTypes.bool,
  dataSource: PropTypes.array,
  render: PropTypes.func,
  targetKeys: PropTypes.array,
  onChange: PropTypes.func,
  height: PropTypes.number,
  style: PropTypes.object,
  listStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  operationStyle: PropTypes.object,
  className: PropTypes.string,
  titles: PropTypes.array,
  operations: PropTypes.array,
  showSearch: PropTypes.bool,
  filterOption: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.node,
  locale: PropTypes.object,
  body: PropTypes.func,
  footer: PropTypes.func,
  rowKey: PropTypes.func,
  lazy: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
(0, _reactLifecyclesCompat.polyfill)(Transfer);
var _default = Transfer;
exports["default"] = _default;
//# sourceMappingURL=index.js.map
