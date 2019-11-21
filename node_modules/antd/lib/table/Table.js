"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _omit = _interopRequireDefault(require("omit.js"));

var _rcTable = _interopRequireWildcard(require("rc-table"));

var PropTypes = _interopRequireWildcard(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _shallowequal = _interopRequireDefault(require("shallowequal"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _filterDropdown = _interopRequireDefault(require("./filterDropdown"));

var _createStore = _interopRequireDefault(require("./createStore"));

var _SelectionBox = _interopRequireDefault(require("./SelectionBox"));

var _SelectionCheckboxAll = _interopRequireDefault(require("./SelectionCheckboxAll"));

var _Column = _interopRequireDefault(require("./Column"));

var _ColumnGroup = _interopRequireDefault(require("./ColumnGroup"));

var _createBodyRow = _interopRequireDefault(require("./createBodyRow"));

var _util = require("./util");

var _scrollTo = _interopRequireDefault(require("../_util/scrollTo"));

var _pagination = _interopRequireDefault(require("../pagination"));

var _icon = _interopRequireDefault(require("../icon"));

var _spin = _interopRequireDefault(require("../spin"));

var _transButton = _interopRequireDefault(require("../_util/transButton"));

var _LocaleReceiver = _interopRequireDefault(require("../locale-provider/LocaleReceiver"));

var _default2 = _interopRequireDefault(require("../locale/default"));

var _configProvider = require("../config-provider");

var _warning = _interopRequireDefault(require("../_util/warning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
/* eslint-disable prefer-spread */


function noop() {}

function stopPropagation(e) {
  e.stopPropagation();
}

function getRowSelection(props) {
  return props.rowSelection || {};
}

function getColumnKey(column, index) {
  return column.key || column.dataIndex || index;
}

function isSameColumn(a, b) {
  if (a && b && a.key && a.key === b.key) {
    return true;
  }

  return a === b || (0, _shallowequal["default"])(a, b, function (value, other) {
    // https://github.com/ant-design/ant-design/issues/12737
    if (typeof value === 'function' && typeof other === 'function') {
      return value === other || value.toString() === other.toString();
    } // https://github.com/ant-design/ant-design/issues/19398


    if (Array.isArray(value) && Array.isArray(other)) {
      return value === other || (0, _shallowequal["default"])(value, other);
    }
  });
}

var defaultPagination = {
  onChange: noop,
  onShowSizeChange: noop
};
/**
 * Avoid creating new object, so that parent component's shouldComponentUpdate
 * can works appropriately。
 */

var emptyObject = {};

var createComponents = function createComponents() {
  var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var bodyRow = components && components.body && components.body.row;
  return _extends(_extends({}, components), {
    body: _extends(_extends({}, components.body), {
      row: (0, _createBodyRow["default"])(bodyRow)
    })
  });
};

function isTheSameComponents() {
  var components1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var components2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return components1 === components2 || ['table', 'header', 'body'].every(function (key) {
    return (0, _shallowequal["default"])(components1[key], components2[key]);
  });
}

function getFilteredValueColumns(state, columns) {
  return (0, _util.flatFilter)(columns || (state || {}).columns || [], function (column) {
    return typeof column.filteredValue !== 'undefined';
  });
}

function getFiltersFromColumns() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var columns = arguments.length > 1 ? arguments[1] : undefined;
  var filters = {};
  getFilteredValueColumns(state, columns).forEach(function (col) {
    var colKey = getColumnKey(col);
    filters[colKey] = col.filteredValue;
  });
  return filters;
}

function isFiltersChanged(state, filters) {
  if (Object.keys(filters).length !== Object.keys(state.filters).length) {
    return true;
  }

  return Object.keys(filters).some(function (columnKey) {
    return filters[columnKey] !== state.filters[columnKey];
  });
}

var Table =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Table, _React$Component);

  function Table(props) {
    var _this;

    _classCallCheck(this, Table);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Table).call(this, props));

    _this.setTableRef = function (table) {
      _this.rcTable = table;
    };

    _this.getCheckboxPropsByItem = function (item, index) {
      var rowSelection = getRowSelection(_this.props);

      if (!rowSelection.getCheckboxProps) {
        return {};
      }

      var key = _this.getRecordKey(item, index); // Cache checkboxProps


      if (!_this.props.checkboxPropsCache[key]) {
        _this.props.checkboxPropsCache[key] = rowSelection.getCheckboxProps(item) || {};
        var checkboxProps = _this.props.checkboxPropsCache[key];
        (0, _warning["default"])(!('checked' in checkboxProps) && !('defaultChecked' in checkboxProps), 'Table', 'Do not set `checked` or `defaultChecked` in `getCheckboxProps`. Please use `selectedRowKeys` instead.');
      }

      return _this.props.checkboxPropsCache[key];
    };

    _this.getRecordKey = function (record, index) {
      var rowKey = _this.props.rowKey;
      var recordKey = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
      (0, _warning["default"])(recordKey !== undefined, 'Table', 'Each record in dataSource of table should have a unique `key` prop, ' + 'or set `rowKey` of Table to an unique primary key, ' + 'see https://u.ant.design/table-row-key');
      return recordKey === undefined ? index : recordKey;
    };

    _this.onRow = function (prefixCls, record, index) {
      var onRow = _this.props.onRow;
      var custom = onRow ? onRow(record, index) : {};
      return _extends(_extends({}, custom), {
        prefixCls: prefixCls,
        store: _this.props.store,
        rowKey: _this.getRecordKey(record, index)
      });
    };

    _this.generatePopupContainerFunc = function (getPopupContainer) {
      var scroll = _this.props.scroll;
      var table = _this.rcTable;

      if (getPopupContainer) {
        return getPopupContainer;
      } // Use undefined to let rc component use default logic.


      return scroll && table ? function () {
        return table.tableNode;
      } : undefined;
    };

    _this.scrollToFirstRow = function () {
      var scroll = _this.props.scroll;

      if (scroll && scroll.scrollToFirstRowOnChange !== false) {
        (0, _scrollTo["default"])(0, {
          getContainer: function getContainer() {
            return _this.rcTable.bodyTable;
          }
        });
      }
    };

    _this.handleFilter = function (column, nextFilters) {
      var props = _this.props;

      var pagination = _extends({}, _this.state.pagination);

      var filters = _extends(_extends({}, _this.state.filters), _defineProperty({}, getColumnKey(column), nextFilters)); // Remove filters not in current columns


      var currentColumnKeys = [];
      (0, _util.treeMap)(_this.state.columns, function (c) {
        if (!c.children) {
          currentColumnKeys.push(getColumnKey(c));
        }
      });
      Object.keys(filters).forEach(function (columnKey) {
        if (currentColumnKeys.indexOf(columnKey) < 0) {
          delete filters[columnKey];
        }
      });

      if (props.pagination) {
        // Reset current prop
        pagination.current = 1;
        pagination.onChange(pagination.current);
      }

      var newState = {
        pagination: pagination,
        filters: {}
      };

      var filtersToSetState = _extends({}, filters); // Remove filters which is controlled


      getFilteredValueColumns(_this.state).forEach(function (col) {
        var columnKey = getColumnKey(col);

        if (columnKey) {
          delete filtersToSetState[columnKey];
        }
      });

      if (Object.keys(filtersToSetState).length > 0) {
        newState.filters = filtersToSetState;
      } // Controlled current prop will not respond user interaction


      if (_typeof(props.pagination) === 'object' && 'current' in props.pagination) {
        newState.pagination = _extends(_extends({}, pagination), {
          current: _this.state.pagination.current
        });
      }

      _this.setState(newState, function () {
        _this.scrollToFirstRow();

        _this.props.store.setState({
          selectionDirty: false
        });

        var onChange = _this.props.onChange;

        if (onChange) {
          onChange.apply(null, _this.prepareParamsArguments(_extends(_extends({}, _this.state), {
            selectionDirty: false,
            filters: filters,
            pagination: pagination
          })));
        }
      });
    };

    _this.handleSelect = function (record, rowIndex, e) {
      var checked = e.target.checked;
      var nativeEvent = e.nativeEvent;
      var defaultSelection = _this.props.store.getState().selectionDirty ? [] : _this.getDefaultSelection();

      var selectedRowKeys = _this.props.store.getState().selectedRowKeys.concat(defaultSelection);

      var key = _this.getRecordKey(record, rowIndex);

      var pivot = _this.state.pivot;

      var rows = _this.getFlatCurrentPageData();

      var realIndex = rowIndex;

      if (_this.props.expandedRowRender) {
        realIndex = rows.findIndex(function (row) {
          return _this.getRecordKey(row, rowIndex) === key;
        });
      }

      if (nativeEvent.shiftKey && pivot !== undefined && realIndex !== pivot) {
        var changeRowKeys = [];
        var direction = Math.sign(pivot - realIndex);
        var dist = Math.abs(pivot - realIndex);
        var step = 0;

        var _loop = function _loop() {
          var i = realIndex + step * direction;
          step += 1;
          var row = rows[i];

          var rowKey = _this.getRecordKey(row, i);

          var checkboxProps = _this.getCheckboxPropsByItem(row, i);

          if (!checkboxProps.disabled) {
            if (selectedRowKeys.includes(rowKey)) {
              if (!checked) {
                selectedRowKeys = selectedRowKeys.filter(function (j) {
                  return rowKey !== j;
                });
                changeRowKeys.push(rowKey);
              }
            } else if (checked) {
              selectedRowKeys.push(rowKey);
              changeRowKeys.push(rowKey);
            }
          }
        };

        while (step <= dist) {
          _loop();
        }

        _this.setState({
          pivot: realIndex
        });

        _this.props.store.setState({
          selectionDirty: true
        });

        _this.setSelectedRowKeys(selectedRowKeys, {
          selectWay: 'onSelectMultiple',
          record: record,
          checked: checked,
          changeRowKeys: changeRowKeys,
          nativeEvent: nativeEvent
        });
      } else {
        if (checked) {
          selectedRowKeys.push(_this.getRecordKey(record, realIndex));
        } else {
          selectedRowKeys = selectedRowKeys.filter(function (i) {
            return key !== i;
          });
        }

        _this.setState({
          pivot: realIndex
        });

        _this.props.store.setState({
          selectionDirty: true
        });

        _this.setSelectedRowKeys(selectedRowKeys, {
          selectWay: 'onSelect',
          record: record,
          checked: checked,
          changeRowKeys: undefined,
          nativeEvent: nativeEvent
        });
      }
    };

    _this.handleRadioSelect = function (record, rowIndex, e) {
      var checked = e.target.checked;
      var nativeEvent = e.nativeEvent;

      var key = _this.getRecordKey(record, rowIndex);

      var selectedRowKeys = [key];

      _this.props.store.setState({
        selectionDirty: true
      });

      _this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: 'onSelect',
        record: record,
        checked: checked,
        changeRowKeys: undefined,
        nativeEvent: nativeEvent
      });
    };

    _this.handleSelectRow = function (selectionKey, index, onSelectFunc) {
      var data = _this.getFlatCurrentPageData();

      var defaultSelection = _this.props.store.getState().selectionDirty ? [] : _this.getDefaultSelection();

      var selectedRowKeys = _this.props.store.getState().selectedRowKeys.concat(defaultSelection);

      var changeableRowKeys = data.filter(function (item, i) {
        return !_this.getCheckboxPropsByItem(item, i).disabled;
      }).map(function (item, i) {
        return _this.getRecordKey(item, i);
      });
      var changeRowKeys = [];
      var selectWay = 'onSelectAll';
      var checked; // handle default selection

      switch (selectionKey) {
        case 'all':
          changeableRowKeys.forEach(function (key) {
            if (selectedRowKeys.indexOf(key) < 0) {
              selectedRowKeys.push(key);
              changeRowKeys.push(key);
            }
          });
          selectWay = 'onSelectAll';
          checked = true;
          break;

        case 'removeAll':
          changeableRowKeys.forEach(function (key) {
            if (selectedRowKeys.indexOf(key) >= 0) {
              selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
              changeRowKeys.push(key);
            }
          });
          selectWay = 'onSelectAll';
          checked = false;
          break;

        case 'invert':
          changeableRowKeys.forEach(function (key) {
            if (selectedRowKeys.indexOf(key) < 0) {
              selectedRowKeys.push(key);
            } else {
              selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
            }

            changeRowKeys.push(key);
            selectWay = 'onSelectInvert';
          });
          break;

        default:
          break;
      }

      _this.props.store.setState({
        selectionDirty: true
      }); // when select custom selection, callback selections[n].onSelect


      var rowSelection = _this.props.rowSelection;
      var customSelectionStartIndex = 2;

      if (rowSelection && rowSelection.hideDefaultSelections) {
        customSelectionStartIndex = 0;
      }

      if (index >= customSelectionStartIndex && typeof onSelectFunc === 'function') {
        return onSelectFunc(changeableRowKeys);
      }

      _this.setSelectedRowKeys(selectedRowKeys, {
        selectWay: selectWay,
        checked: checked,
        changeRowKeys: changeRowKeys
      });
    };

    _this.handlePageChange = function (current) {
      var props = _this.props;

      var pagination = _extends({}, _this.state.pagination);

      if (current) {
        pagination.current = current;
      } else {
        pagination.current = pagination.current || 1;
      }

      for (var _len = arguments.length, otherArguments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        otherArguments[_key - 1] = arguments[_key];
      }

      pagination.onChange.apply(pagination, [pagination.current].concat(otherArguments));
      var newState = {
        pagination: pagination
      }; // Controlled current prop will not respond user interaction

      if (props.pagination && _typeof(props.pagination) === 'object' && 'current' in props.pagination) {
        newState.pagination = _extends(_extends({}, pagination), {
          current: _this.state.pagination.current
        });
      }

      _this.setState(newState, _this.scrollToFirstRow);

      _this.props.store.setState({
        selectionDirty: false
      });

      var onChange = _this.props.onChange;

      if (onChange) {
        onChange.apply(null, _this.prepareParamsArguments(_extends(_extends({}, _this.state), {
          selectionDirty: false,
          pagination: pagination
        })));
      }
    };

    _this.handleShowSizeChange = function (current, pageSize) {
      var pagination = _this.state.pagination;
      pagination.onShowSizeChange(current, pageSize);

      var nextPagination = _extends(_extends({}, pagination), {
        pageSize: pageSize,
        current: current
      });

      _this.setState({
        pagination: nextPagination
      }, _this.scrollToFirstRow);

      var onChange = _this.props.onChange;

      if (onChange) {
        onChange.apply(null, _this.prepareParamsArguments(_extends(_extends({}, _this.state), {
          pagination: nextPagination
        })));
      }
    };

    _this.renderExpandIcon = function (prefixCls) {
      return function (_ref) {
        var expandable = _ref.expandable,
            expanded = _ref.expanded,
            needIndentSpaced = _ref.needIndentSpaced,
            record = _ref.record,
            onExpand = _ref.onExpand;

        if (expandable) {
          return React.createElement(_LocaleReceiver["default"], {
            componentName: "Table",
            defaultLocale: _default2["default"].Table
          }, function (locale) {
            var _classNames;

            return React.createElement(_transButton["default"], {
              className: (0, _classnames["default"])("".concat(prefixCls, "-row-expand-icon"), (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-row-collapsed"), !expanded), _defineProperty(_classNames, "".concat(prefixCls, "-row-expanded"), expanded), _classNames)),
              onClick: function onClick(event) {
                onExpand(record, event);
              },
              "aria-label": expanded ? locale.collapse : locale.expand,
              noStyle: true
            });
          });
        }

        if (needIndentSpaced) {
          return React.createElement("span", {
            className: "".concat(prefixCls, "-row-expand-icon ").concat(prefixCls, "-row-spaced")
          });
        }

        return null;
      };
    };

    _this.renderSelectionBox = function (type) {
      return function (_, record, index) {
        var rowKey = _this.getRecordKey(record, index);

        var props = _this.getCheckboxPropsByItem(record, index);

        var handleChange = function handleChange(e) {
          return type === 'radio' ? _this.handleRadioSelect(record, index, e) : _this.handleSelect(record, index, e);
        };

        return React.createElement("span", {
          onClick: stopPropagation
        }, React.createElement(_SelectionBox["default"], _extends({
          type: type,
          store: _this.props.store,
          rowIndex: rowKey,
          onChange: handleChange,
          defaultSelection: _this.getDefaultSelection()
        }, props)));
      };
    };

    _this.renderTable = function (_ref2) {
      var _classNames2;

      var prefixCls = _ref2.prefixCls,
          renderEmpty = _ref2.renderEmpty,
          dropdownPrefixCls = _ref2.dropdownPrefixCls,
          contextLocale = _ref2.contextLocale,
          contextGetPopupContainer = _ref2.getPopupContainer;

      var _a = _this.props,
          showHeader = _a.showHeader,
          locale = _a.locale,
          getPopupContainer = _a.getPopupContainer,
          restTableProps = __rest(_a, ["showHeader", "locale", "getPopupContainer"]); // do not pass prop.style to rc-table, since already apply it to container div


      var restProps = (0, _omit["default"])(restTableProps, ['style']);

      var data = _this.getCurrentPageData();

      var expandIconAsCell = _this.props.expandedRowRender && _this.props.expandIconAsCell !== false; // use props.getPopupContainer first

      var realGetPopupContainer = getPopupContainer || contextGetPopupContainer; // Merge too locales

      var mergedLocale = _extends(_extends({}, contextLocale), locale);

      if (!locale || !locale.emptyText) {
        mergedLocale.emptyText = renderEmpty('Table');
      }

      var classString = (0, _classnames["default"])("".concat(prefixCls, "-").concat(_this.props.size), (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-bordered"), _this.props.bordered), _defineProperty(_classNames2, "".concat(prefixCls, "-empty"), !data.length), _defineProperty(_classNames2, "".concat(prefixCls, "-without-column-header"), !showHeader), _classNames2));

      var columnsWithRowSelection = _this.renderRowSelection({
        prefixCls: prefixCls,
        locale: mergedLocale,
        getPopupContainer: realGetPopupContainer
      });

      var columns = _this.renderColumnsDropdown({
        columns: columnsWithRowSelection,
        prefixCls: prefixCls,
        dropdownPrefixCls: dropdownPrefixCls,
        locale: mergedLocale,
        getPopupContainer: realGetPopupContainer
      }).map(function (column, i) {
        var newColumn = _extends({}, column);

        newColumn.key = getColumnKey(newColumn, i);
        return newColumn;
      });

      var expandIconColumnIndex = columns[0] && columns[0].key === 'selection-column' ? 1 : 0;

      if ('expandIconColumnIndex' in restProps) {
        expandIconColumnIndex = restProps.expandIconColumnIndex;
      }

      return React.createElement(_rcTable["default"], _extends({
        ref: _this.setTableRef,
        key: "table",
        expandIcon: _this.renderExpandIcon(prefixCls)
      }, restProps, {
        onRow: function onRow(record, index) {
          return _this.onRow(prefixCls, record, index);
        },
        components: _this.state.components,
        prefixCls: prefixCls,
        data: data,
        columns: columns,
        showHeader: showHeader,
        className: classString,
        expandIconColumnIndex: expandIconColumnIndex,
        expandIconAsCell: expandIconAsCell,
        emptyText: mergedLocale.emptyText
      }));
    };

    _this.renderComponent = function (_ref3) {
      var getPrefixCls = _ref3.getPrefixCls,
          renderEmpty = _ref3.renderEmpty,
          getPopupContainer = _ref3.getPopupContainer;
      var _this$props = _this.props,
          customizePrefixCls = _this$props.prefixCls,
          customizeDropdownPrefixCls = _this$props.dropdownPrefixCls,
          style = _this$props.style,
          className = _this$props.className;

      var data = _this.getCurrentPageData();

      var loading = _this.props.loading;

      if (typeof loading === 'boolean') {
        loading = {
          spinning: loading
        };
      }

      var prefixCls = getPrefixCls('table', customizePrefixCls);
      var dropdownPrefixCls = getPrefixCls('dropdown', customizeDropdownPrefixCls);
      var table = React.createElement(_LocaleReceiver["default"], {
        componentName: "Table",
        defaultLocale: _default2["default"].Table
      }, function (locale) {
        return _this.renderTable({
          prefixCls: prefixCls,
          renderEmpty: renderEmpty,
          dropdownPrefixCls: dropdownPrefixCls,
          contextLocale: locale,
          getPopupContainer: getPopupContainer
        });
      }); // if there is no pagination or no data,
      // the height of spin should decrease by half of pagination

      var paginationPatchClass = _this.hasPagination() && data && data.length !== 0 ? "".concat(prefixCls, "-with-pagination") : "".concat(prefixCls, "-without-pagination");
      return React.createElement("div", {
        className: (0, _classnames["default"])("".concat(prefixCls, "-wrapper"), className),
        style: style
      }, React.createElement(_spin["default"], _extends({}, loading, {
        className: loading.spinning ? "".concat(paginationPatchClass, " ").concat(prefixCls, "-spin-holder") : ''
      }), _this.renderPagination(prefixCls, 'top'), table, _this.renderPagination(prefixCls, 'bottom')));
    };

    var expandedRowRender = props.expandedRowRender,
        columnsProp = props.columns;
    (0, _warning["default"])(!('columnsPageRange' in props || 'columnsPageSize' in props), 'Table', '`columnsPageRange` and `columnsPageSize` are removed, please use ' + 'fixed columns instead, see: https://u.ant.design/fixed-columns.');

    if (expandedRowRender && (columnsProp || []).some(function (_ref4) {
      var fixed = _ref4.fixed;
      return !!fixed;
    })) {
      (0, _warning["default"])(false, 'Table', '`expandedRowRender` and `Column.fixed` are not compatible. Please use one of them at one time.');
    }

    var columns = columnsProp || (0, _util.normalizeColumns)(props.children);
    _this.state = _extends(_extends({}, _this.getDefaultSortOrder(columns || [])), {
      // 减少状态
      filters: getFiltersFromColumns(),
      pagination: _this.getDefaultPagination(props),
      pivot: undefined,
      prevProps: props,
      components: createComponents(props.components),
      columns: columns
    });
    return _this;
  }

  _createClass(Table, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$state = this.state,
          columns = _this$state.columns,
          sortColumn = _this$state.sortColumn,
          sortOrder = _this$state.sortOrder;

      if (this.getSortOrderColumns(columns).length > 0) {
        var sortState = this.getSortStateFromColumns(columns);

        if (!isSameColumn(sortState.sortColumn, sortColumn) || sortState.sortOrder !== sortOrder) {
          this.setState(sortState);
        }
      }
    }
  }, {
    key: "getDefaultSelection",
    value: function getDefaultSelection() {
      var _this2 = this;

      var rowSelection = getRowSelection(this.props);

      if (!rowSelection.getCheckboxProps) {
        return [];
      }

      return this.getFlatData().filter(function (item, rowIndex) {
        return _this2.getCheckboxPropsByItem(item, rowIndex).defaultChecked;
      }).map(function (record, rowIndex) {
        return _this2.getRecordKey(record, rowIndex);
      });
    }
  }, {
    key: "getDefaultPagination",
    value: function getDefaultPagination(props) {
      var pagination = _typeof(props.pagination) === 'object' ? props.pagination : {};
      var current;

      if ('current' in pagination) {
        current = pagination.current;
      } else if ('defaultCurrent' in pagination) {
        current = pagination.defaultCurrent;
      }

      var pageSize;

      if ('pageSize' in pagination) {
        pageSize = pagination.pageSize;
      } else if ('defaultPageSize' in pagination) {
        pageSize = pagination.defaultPageSize;
      }

      return this.hasPagination(props) ? _extends(_extends(_extends({}, defaultPagination), pagination), {
        current: current || 1,
        pageSize: pageSize || 10
      }) : {};
    }
  }, {
    key: "getSortOrderColumns",
    value: function getSortOrderColumns(columns) {
      return (0, _util.flatFilter)(columns || (this.state || {}).columns || [], function (column) {
        return 'sortOrder' in column;
      });
    }
  }, {
    key: "getDefaultSortOrder",
    value: function getDefaultSortOrder(columns) {
      var definedSortState = this.getSortStateFromColumns(columns);
      var defaultSortedColumn = (0, _util.flatFilter)(columns || [], function (column) {
        return column.defaultSortOrder != null;
      })[0];

      if (defaultSortedColumn && !definedSortState.sortColumn) {
        return {
          sortColumn: defaultSortedColumn,
          sortOrder: defaultSortedColumn.defaultSortOrder
        };
      }

      return definedSortState;
    }
  }, {
    key: "getSortStateFromColumns",
    value: function getSortStateFromColumns(columns) {
      // return first column which sortOrder is not falsy
      var sortedColumn = this.getSortOrderColumns(columns).filter(function (col) {
        return col.sortOrder;
      })[0];

      if (sortedColumn) {
        return {
          sortColumn: sortedColumn,
          sortOrder: sortedColumn.sortOrder
        };
      }

      return {
        sortColumn: null,
        sortOrder: null
      };
    }
  }, {
    key: "getMaxCurrent",
    value: function getMaxCurrent(total) {
      var _this$state$paginatio = this.state.pagination,
          current = _this$state$paginatio.current,
          pageSize = _this$state$paginatio.pageSize;

      if ((current - 1) * pageSize >= total) {
        return Math.floor((total - 1) / pageSize) + 1;
      }

      return current;
    }
  }, {
    key: "getSorterFn",
    value: function getSorterFn(state) {
      var _ref5 = state || this.state,
          sortOrder = _ref5.sortOrder,
          sortColumn = _ref5.sortColumn;

      if (!sortOrder || !sortColumn || typeof sortColumn.sorter !== 'function') {
        return;
      }

      return function (a, b) {
        var result = sortColumn.sorter(a, b, sortOrder);

        if (result !== 0) {
          return sortOrder === 'descend' ? -result : result;
        }

        return 0;
      };
    }
  }, {
    key: "getCurrentPageData",
    value: function getCurrentPageData() {
      var data = this.getLocalData();
      var current;
      var pageSize;
      var state = this.state; // 如果没有分页的话，默认全部展示

      if (!this.hasPagination()) {
        pageSize = Number.MAX_VALUE;
        current = 1;
      } else {
        pageSize = state.pagination.pageSize;
        current = this.getMaxCurrent(state.pagination.total || data.length);
      } // 分页
      // ---
      // 当数据量少于等于每页数量时，直接设置数据
      // 否则进行读取分页数据


      if (data.length > pageSize || pageSize === Number.MAX_VALUE) {
        data = data.slice((current - 1) * pageSize, current * pageSize);
      }

      return data;
    }
  }, {
    key: "getFlatData",
    value: function getFlatData() {
      var childrenColumnName = this.props.childrenColumnName;
      return (0, _util.flatArray)(this.getLocalData(null, false), childrenColumnName);
    }
  }, {
    key: "getFlatCurrentPageData",
    value: function getFlatCurrentPageData() {
      var childrenColumnName = this.props.childrenColumnName;
      return (0, _util.flatArray)(this.getCurrentPageData(), childrenColumnName);
    }
  }, {
    key: "getLocalData",
    value: function getLocalData(state) {
      var _this3 = this;

      var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var currentState = state || this.state;
      var dataSource = this.props.dataSource;
      var data = dataSource || []; // 优化本地排序

      data = data.slice(0);
      var sorterFn = this.getSorterFn(currentState);

      if (sorterFn) {
        data = this.recursiveSort(data, sorterFn);
      } // 筛选


      if (filter && currentState.filters) {
        Object.keys(currentState.filters).forEach(function (columnKey) {
          var col = _this3.findColumn(columnKey);

          if (!col) {
            return;
          }

          var values = currentState.filters[columnKey] || [];

          if (values.length === 0) {
            return;
          }

          var onFilter = col.onFilter;
          data = onFilter ? data.filter(function (record) {
            return values.some(function (v) {
              return onFilter(v, record);
            });
          }) : data;
        });
      }

      return data;
    }
  }, {
    key: "setSelectedRowKeys",
    value: function setSelectedRowKeys(selectedRowKeys, selectionInfo) {
      var _this4 = this;

      var selectWay = selectionInfo.selectWay,
          record = selectionInfo.record,
          checked = selectionInfo.checked,
          changeRowKeys = selectionInfo.changeRowKeys,
          nativeEvent = selectionInfo.nativeEvent;
      var rowSelection = getRowSelection(this.props);

      if (rowSelection && !('selectedRowKeys' in rowSelection)) {
        this.props.store.setState({
          selectedRowKeys: selectedRowKeys
        });
      }

      var data = this.getFlatData();

      if (!rowSelection.onChange && !rowSelection[selectWay]) {
        return;
      }

      var selectedRows = data.filter(function (row, i) {
        return selectedRowKeys.indexOf(_this4.getRecordKey(row, i)) >= 0;
      });

      if (rowSelection.onChange) {
        rowSelection.onChange(selectedRowKeys, selectedRows);
      }

      if (selectWay === 'onSelect' && rowSelection.onSelect) {
        rowSelection.onSelect(record, checked, selectedRows, nativeEvent);
      } else if (selectWay === 'onSelectMultiple' && rowSelection.onSelectMultiple) {
        var changeRows = data.filter(function (row, i) {
          return changeRowKeys.indexOf(_this4.getRecordKey(row, i)) >= 0;
        });
        rowSelection.onSelectMultiple(checked, selectedRows, changeRows);
      } else if (selectWay === 'onSelectAll' && rowSelection.onSelectAll) {
        var _changeRows = data.filter(function (row, i) {
          return changeRowKeys.indexOf(_this4.getRecordKey(row, i)) >= 0;
        });

        rowSelection.onSelectAll(checked, selectedRows, _changeRows);
      } else if (selectWay === 'onSelectInvert' && rowSelection.onSelectInvert) {
        rowSelection.onSelectInvert(selectedRowKeys);
      }
    }
  }, {
    key: "toggleSortOrder",
    value: function toggleSortOrder(column) {
      var pagination = _extends({}, this.state.pagination);

      var sortDirections = column.sortDirections || this.props.sortDirections;
      var _this$state2 = this.state,
          sortOrder = _this$state2.sortOrder,
          sortColumn = _this$state2.sortColumn; // 只同时允许一列进行排序，否则会导致排序顺序的逻辑问题

      var newSortOrder; // 切换另一列时，丢弃 sortOrder 的状态

      if (isSameColumn(sortColumn, column) && sortOrder !== undefined) {
        // 按照sortDirections的内容依次切换排序状态
        var methodIndex = sortDirections.indexOf(sortOrder) + 1;
        newSortOrder = methodIndex === sortDirections.length ? undefined : sortDirections[methodIndex];
      } else {
        newSortOrder = sortDirections[0];
      }

      if (this.props.pagination) {
        // Reset current prop
        pagination.current = 1;
        pagination.onChange(pagination.current);
      }

      var newState = {
        pagination: pagination,
        sortOrder: newSortOrder,
        sortColumn: newSortOrder ? column : null
      }; // Controlled

      if (this.getSortOrderColumns().length === 0) {
        this.setState(newState, this.scrollToFirstRow);
      }

      var onChange = this.props.onChange;

      if (onChange) {
        onChange.apply(null, this.prepareParamsArguments(_extends(_extends({}, this.state), newState), column));
      }
    }
  }, {
    key: "hasPagination",
    value: function hasPagination(props) {
      return (props || this.props).pagination !== false;
    }
  }, {
    key: "isSortColumn",
    value: function isSortColumn(column) {
      var sortColumn = this.state.sortColumn;

      if (!column || !sortColumn) {
        return false;
      }

      return getColumnKey(sortColumn) === getColumnKey(column);
    } // Get pagination, filters, sorter

  }, {
    key: "prepareParamsArguments",
    value: function prepareParamsArguments(state, column) {
      var pagination = _extends({}, state.pagination); // remove useless handle function in Table.onChange


      delete pagination.onChange;
      delete pagination.onShowSizeChange;
      var filters = state.filters;
      var sorter = {};
      var currentColumn = column;

      if (state.sortColumn && state.sortOrder) {
        currentColumn = state.sortColumn;
        sorter.column = state.sortColumn;
        sorter.order = state.sortOrder;
      }

      if (currentColumn) {
        sorter.field = currentColumn.dataIndex;
        sorter.columnKey = getColumnKey(currentColumn);
      }

      var extra = {
        currentDataSource: this.getLocalData(state)
      };
      return [pagination, filters, sorter, extra];
    }
  }, {
    key: "findColumn",
    value: function findColumn(myKey) {
      var column;
      (0, _util.treeMap)(this.state.columns, function (c) {
        if (getColumnKey(c) === myKey) {
          column = c;
        }
      });
      return column;
    }
  }, {
    key: "recursiveSort",
    value: function recursiveSort(data, sorterFn) {
      var _this5 = this;

      var _this$props$childrenC = this.props.childrenColumnName,
          childrenColumnName = _this$props$childrenC === void 0 ? 'children' : _this$props$childrenC;
      return data.sort(sorterFn).map(function (item) {
        return item[childrenColumnName] ? _extends(_extends({}, item), _defineProperty({}, childrenColumnName, _this5.recursiveSort(item[childrenColumnName], sorterFn))) : item;
      });
    }
  }, {
    key: "renderPagination",
    value: function renderPagination(prefixCls, paginationPosition) {
      // 强制不需要分页
      if (!this.hasPagination()) {
        return null;
      }

      var size = 'default';
      var pagination = this.state.pagination;

      if (pagination.size) {
        size = pagination.size;
      } else if (this.props.size === 'middle' || this.props.size === 'small') {
        size = 'small';
      }

      var position = pagination.position || 'bottom';
      var total = pagination.total || this.getLocalData().length;
      return total > 0 && (position === paginationPosition || position === 'both') ? React.createElement(_pagination["default"], _extends({
        key: "pagination-".concat(paginationPosition)
      }, pagination, {
        className: (0, _classnames["default"])(pagination.className, "".concat(prefixCls, "-pagination")),
        onChange: this.handlePageChange,
        total: total,
        size: size,
        current: this.getMaxCurrent(total),
        onShowSizeChange: this.handleShowSizeChange
      })) : null;
    }
  }, {
    key: "renderRowSelection",
    value: function renderRowSelection(_ref6) {
      var _this6 = this;

      var prefixCls = _ref6.prefixCls,
          locale = _ref6.locale,
          getPopupContainer = _ref6.getPopupContainer;
      var rowSelection = this.props.rowSelection;
      var columns = this.state.columns.concat();

      if (rowSelection) {
        var data = this.getFlatCurrentPageData().filter(function (item, index) {
          if (rowSelection.getCheckboxProps) {
            return !_this6.getCheckboxPropsByItem(item, index).disabled;
          }

          return true;
        });
        var selectionColumnClass = (0, _classnames["default"])("".concat(prefixCls, "-selection-column"), _defineProperty({}, "".concat(prefixCls, "-selection-column-custom"), rowSelection.selections));

        var selectionColumn = _defineProperty({
          key: 'selection-column',
          render: this.renderSelectionBox(rowSelection.type),
          className: selectionColumnClass,
          fixed: rowSelection.fixed,
          width: rowSelection.columnWidth,
          title: rowSelection.columnTitle
        }, _rcTable.INTERNAL_COL_DEFINE, {
          className: "".concat(prefixCls, "-selection-col")
        });

        if (rowSelection.type !== 'radio') {
          var checkboxAllDisabled = data.every(function (item, index) {
            return _this6.getCheckboxPropsByItem(item, index).disabled;
          });
          selectionColumn.title = selectionColumn.title || React.createElement(_SelectionCheckboxAll["default"], {
            store: this.props.store,
            locale: locale,
            data: data,
            getCheckboxPropsByItem: this.getCheckboxPropsByItem,
            getRecordKey: this.getRecordKey,
            disabled: checkboxAllDisabled,
            prefixCls: prefixCls,
            onSelect: this.handleSelectRow,
            selections: rowSelection.selections,
            hideDefaultSelections: rowSelection.hideDefaultSelections,
            getPopupContainer: this.generatePopupContainerFunc(getPopupContainer)
          });
        }

        if ('fixed' in rowSelection) {
          selectionColumn.fixed = rowSelection.fixed;
        } else if (columns.some(function (column) {
          return column.fixed === 'left' || column.fixed === true;
        })) {
          selectionColumn.fixed = 'left';
        }

        if (columns[0] && columns[0].key === 'selection-column') {
          columns[0] = selectionColumn;
        } else {
          columns.unshift(selectionColumn);
        }
      }

      return columns;
    }
  }, {
    key: "renderColumnsDropdown",
    value: function renderColumnsDropdown(_ref7) {
      var _this7 = this;

      var prefixCls = _ref7.prefixCls,
          dropdownPrefixCls = _ref7.dropdownPrefixCls,
          columns = _ref7.columns,
          locale = _ref7.locale,
          getPopupContainer = _ref7.getPopupContainer;
      var _this$state3 = this.state,
          sortOrder = _this$state3.sortOrder,
          filters = _this$state3.filters;
      return (0, _util.treeMap)(columns, function (column, i) {
        var _classNames4;

        var key = getColumnKey(column, i);
        var filterDropdown;
        var sortButton;
        var onHeaderCell = column.onHeaderCell;

        var isSortColumn = _this7.isSortColumn(column);

        if (column.filters && column.filters.length > 0 || column.filterDropdown) {
          var colFilters = key in filters ? filters[key] : [];
          filterDropdown = React.createElement(_filterDropdown["default"], {
            locale: locale,
            column: column,
            selectedKeys: colFilters,
            confirmFilter: _this7.handleFilter,
            prefixCls: "".concat(prefixCls, "-filter"),
            dropdownPrefixCls: dropdownPrefixCls || 'ant-dropdown',
            getPopupContainer: _this7.generatePopupContainerFunc(getPopupContainer),
            key: "filter-dropdown"
          });
        }

        if (column.sorter) {
          var sortDirections = column.sortDirections || _this7.props.sortDirections;
          var isAscend = isSortColumn && sortOrder === 'ascend';
          var isDescend = isSortColumn && sortOrder === 'descend';
          var ascend = sortDirections.indexOf('ascend') !== -1 && React.createElement(_icon["default"], {
            className: "".concat(prefixCls, "-column-sorter-up ").concat(isAscend ? 'on' : 'off'),
            type: "caret-up",
            theme: "filled"
          });
          var descend = sortDirections.indexOf('descend') !== -1 && React.createElement(_icon["default"], {
            className: "".concat(prefixCls, "-column-sorter-down ").concat(isDescend ? 'on' : 'off'),
            type: "caret-down",
            theme: "filled"
          });
          sortButton = React.createElement("div", {
            title: locale.sortTitle,
            className: (0, _classnames["default"])("".concat(prefixCls, "-column-sorter-inner"), ascend && descend && "".concat(prefixCls, "-column-sorter-inner-full")),
            key: "sorter"
          }, ascend, descend);

          onHeaderCell = function onHeaderCell(col) {
            var colProps = {}; // Get original first

            if (column.onHeaderCell) {
              colProps = _extends({}, column.onHeaderCell(col));
            } // Add sorter logic


            var onHeaderCellClick = colProps.onClick;

            colProps.onClick = function () {
              _this7.toggleSortOrder(column);

              if (onHeaderCellClick) {
                onHeaderCellClick.apply(void 0, arguments);
              }
            };

            return colProps;
          };
        }

        return _extends(_extends({}, column), {
          className: (0, _classnames["default"])(column.className, (_classNames4 = {}, _defineProperty(_classNames4, "".concat(prefixCls, "-column-has-actions"), sortButton || filterDropdown), _defineProperty(_classNames4, "".concat(prefixCls, "-column-has-filters"), filterDropdown), _defineProperty(_classNames4, "".concat(prefixCls, "-column-has-sorters"), sortButton), _defineProperty(_classNames4, "".concat(prefixCls, "-column-sort"), isSortColumn && sortOrder), _classNames4)),
          title: [React.createElement("span", {
            key: "title",
            className: "".concat(prefixCls, "-header-column")
          }, React.createElement("div", {
            className: sortButton ? "".concat(prefixCls, "-column-sorters") : undefined
          }, React.createElement("span", {
            className: "".concat(prefixCls, "-column-title")
          }, _this7.renderColumnTitle(column.title)), React.createElement("span", {
            className: "".concat(prefixCls, "-column-sorter")
          }, sortButton))), filterDropdown],
          onHeaderCell: onHeaderCell
        });
      });
    }
  }, {
    key: "renderColumnTitle",
    value: function renderColumnTitle(title) {
      var _this$state4 = this.state,
          filters = _this$state4.filters,
          sortOrder = _this$state4.sortOrder,
          sortColumn = _this$state4.sortColumn; // https://github.com/ant-design/ant-design/issues/11246#issuecomment-405009167

      if (title instanceof Function) {
        return title({
          filters: filters,
          sortOrder: sortOrder,
          sortColumn: sortColumn
        });
      }

      return title;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderComponent);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var prevProps = prevState.prevProps;
      var columns = nextProps.columns || (0, _util.normalizeColumns)(nextProps.children);

      var nextState = _extends(_extends({}, prevState), {
        prevProps: nextProps,
        columns: columns
      });

      if ('pagination' in nextProps || 'pagination' in prevProps) {
        var newPagination = _extends(_extends(_extends({}, defaultPagination), prevState.pagination), nextProps.pagination);

        newPagination.current = newPagination.current || 1;
        newPagination.pageSize = newPagination.pageSize || 10;
        nextState = _extends(_extends({}, nextState), {
          pagination: nextProps.pagination !== false ? newPagination : emptyObject
        });
      }

      if (nextProps.rowSelection && 'selectedRowKeys' in nextProps.rowSelection) {
        nextProps.store.setState({
          selectedRowKeys: nextProps.rowSelection.selectedRowKeys || []
        });
      } else if (prevProps.rowSelection && !nextProps.rowSelection) {
        nextProps.store.setState({
          selectedRowKeys: []
        });
      }

      if ('dataSource' in nextProps && nextProps.dataSource !== prevProps.dataSource) {
        nextProps.store.setState({
          selectionDirty: false
        });
      } // https://github.com/ant-design/ant-design/issues/10133


      nextProps.setCheckboxPropsCache({}); // Update filters

      var filteredValueColumns = getFilteredValueColumns(nextState, nextState.columns);

      if (filteredValueColumns.length > 0) {
        var filtersFromColumns = getFiltersFromColumns(nextState, nextState.columns);

        var newFilters = _extends({}, nextState.filters);

        Object.keys(filtersFromColumns).forEach(function (key) {
          newFilters[key] = filtersFromColumns[key];
        });

        if (isFiltersChanged(nextState, newFilters)) {
          nextState = _extends(_extends({}, nextState), {
            filters: newFilters
          });
        }
      }

      if (!isTheSameComponents(nextProps.components, prevProps.components)) {
        var components = createComponents(nextProps.components);
        nextState = _extends(_extends({}, nextState), {
          components: components
        });
      }

      return nextState;
    }
  }]);

  return Table;
}(React.Component);

Table.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  prefixCls: PropTypes.string,
  useFixedHeader: PropTypes.bool,
  rowSelection: PropTypes.object,
  className: PropTypes.string,
  size: PropTypes.string,
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  bordered: PropTypes.bool,
  onChange: PropTypes.func,
  locale: PropTypes.object,
  dropdownPrefixCls: PropTypes.string,
  sortDirections: PropTypes.array,
  getPopupContainer: PropTypes.func
};
Table.defaultProps = {
  dataSource: [],
  useFixedHeader: false,
  className: '',
  size: 'default',
  loading: false,
  bordered: false,
  indentSize: 20,
  locale: {},
  rowKey: 'key',
  showHeader: true,
  sortDirections: ['ascend', 'descend'],
  childrenColumnName: 'children'
};
(0, _reactLifecyclesCompat.polyfill)(Table);

var StoreTable =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(StoreTable, _React$Component2);

  function StoreTable(props) {
    var _this8;

    _classCallCheck(this, StoreTable);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(StoreTable).call(this, props));

    _this8.setCheckboxPropsCache = function (cache) {
      return _this8.CheckboxPropsCache = cache;
    };

    _this8.CheckboxPropsCache = {};
    _this8.store = (0, _createStore["default"])({
      selectedRowKeys: getRowSelection(props).selectedRowKeys || [],
      selectionDirty: false
    });
    return _this8;
  }

  _createClass(StoreTable, [{
    key: "render",
    value: function render() {
      return React.createElement(Table, _extends({}, this.props, {
        store: this.store,
        checkboxPropsCache: this.CheckboxPropsCache,
        setCheckboxPropsCache: this.setCheckboxPropsCache
      }));
    }
  }]);

  return StoreTable;
}(React.Component);

StoreTable.displayName = 'withStore(Table)';
StoreTable.Column = _Column["default"];
StoreTable.ColumnGroup = _ColumnGroup["default"];
var _default = StoreTable;
exports["default"] = _default;
//# sourceMappingURL=Table.js.map
