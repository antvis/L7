"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _KeyCode = _interopRequireDefault(require("rc-util/lib/KeyCode"));

var _shallowequal = _interopRequireDefault(require("shallowequal"));

var _raf = _interopRequireDefault(require("raf"));

var _domScrollIntoView = _interopRequireDefault(require("dom-scroll-into-view"));

var _SelectTrigger = _interopRequireDefault(require("./SelectTrigger"));

var _BaseSelector = require("./Base/BaseSelector");

var _BasePopup = require("./Base/BasePopup");

var _SingleSelector = _interopRequireDefault(require("./Selector/SingleSelector"));

var _MultipleSelector = _interopRequireWildcard(require("./Selector/MultipleSelector"));

var _SinglePopup = _interopRequireDefault(require("./Popup/SinglePopup"));

var _MultiplePopup = _interopRequireDefault(require("./Popup/MultiplePopup"));

var _strategies = require("./strategies");

var _util = require("./util");

var _propTypes2 = require("./propTypes");

var _SelectNode = _interopRequireDefault(require("./SelectNode"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Select =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Select, _React$Component);

  function Select(_props) {
    var _this;

    _classCallCheck(this, Select);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Select).call(this, _props));

    _defineProperty(_assertThisInitialized(_this), "onSelectorFocus", function () {
      _this.setState({
        focused: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onSelectorBlur", function () {
      _this.setState({
        focused: false
      }); // TODO: Close when Popup is also not focused
      // this.setState({ open: false });

    });

    _defineProperty(_assertThisInitialized(_this), "onComponentKeyDown", function (event) {
      var open = _this.state.open;
      var keyCode = event.keyCode;

      if (!open) {
        if ([_KeyCode["default"].ENTER, _KeyCode["default"].DOWN].indexOf(keyCode) !== -1) {
          _this.setOpenState(true);
        }
      } else if (_KeyCode["default"].ESC === keyCode) {
        _this.setOpenState(false);
      } else if ([_KeyCode["default"].UP, _KeyCode["default"].DOWN, _KeyCode["default"].LEFT, _KeyCode["default"].RIGHT].indexOf(keyCode) !== -1) {
        // TODO: Handle `open` state
        event.stopPropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onDeselect", function (wrappedValue, node, nodeEventInfo) {
      var onDeselect = _this.props.onDeselect;
      if (!onDeselect) return;
      onDeselect(wrappedValue, node, nodeEventInfo);
    });

    _defineProperty(_assertThisInitialized(_this), "onSelectorClear", function (event) {
      var disabled = _this.props.disabled;
      if (disabled) return;

      _this.triggerChange([], []);

      if (!_this.isSearchValueControlled()) {
        _this.setUncontrolledState({
          searchValue: '',
          filteredTreeNodes: null
        });
      }

      event.stopPropagation();
    });

    _defineProperty(_assertThisInitialized(_this), "onMultipleSelectorRemove", function (event, removeValue) {
      event.stopPropagation();
      var _this$state = _this.state,
          valueList = _this$state.valueList,
          missValueList = _this$state.missValueList,
          valueEntities = _this$state.valueEntities;
      var _this$props = _this.props,
          treeCheckable = _this$props.treeCheckable,
          treeCheckStrictly = _this$props.treeCheckStrictly,
          treeNodeLabelProp = _this$props.treeNodeLabelProp,
          disabled = _this$props.disabled;
      if (disabled) return; // Find trigger entity

      var triggerEntity = valueEntities[removeValue]; // Clean up value

      var newValueList = valueList;

      if (triggerEntity) {
        // If value is in tree
        if (treeCheckable && !treeCheckStrictly) {
          newValueList = valueList.filter(function (_ref) {
            var value = _ref.value;
            var entity = valueEntities[value];
            return !(0, _util.isPosRelated)(entity.pos, triggerEntity.pos);
          });
        } else {
          newValueList = valueList.filter(function (_ref2) {
            var value = _ref2.value;
            return value !== removeValue;
          });
        }
      }

      var triggerNode = triggerEntity ? triggerEntity.node : null;
      var extraInfo = {
        triggerValue: removeValue,
        triggerNode: triggerNode
      };
      var deselectInfo = {
        node: triggerNode
      }; // [Legacy] Little hack on this to make same action as `onCheck` event.

      if (treeCheckable) {
        var filteredEntityList = newValueList.map(function (_ref3) {
          var value = _ref3.value;
          return valueEntities[value];
        });
        deselectInfo.event = 'check';
        deselectInfo.checked = false;
        deselectInfo.checkedNodes = filteredEntityList.map(function (_ref4) {
          var node = _ref4.node;
          return node;
        });
        deselectInfo.checkedNodesPositions = filteredEntityList.map(function (_ref5) {
          var node = _ref5.node,
              pos = _ref5.pos;
          return {
            node: node,
            pos: pos
          };
        });

        if (treeCheckStrictly) {
          extraInfo.allCheckedNodes = deselectInfo.checkedNodes;
        } else {
          // TODO: It's too expansive to get `halfCheckedKeys` in onDeselect. Not pass this.
          extraInfo.allCheckedNodes = (0, _util.flatToHierarchy)(filteredEntityList).map(function (_ref6) {
            var node = _ref6.node;
            return node;
          });
        }
      } else {
        deselectInfo.event = 'select';
        deselectInfo.selected = false;
        deselectInfo.selectedNodes = newValueList.map(function (_ref7) {
          var value = _ref7.value;
          return (valueEntities[value] || {}).node;
        });
      } // Some value user pass prop is not in the tree, we also need clean it


      var newMissValueList = missValueList.filter(function (_ref8) {
        var value = _ref8.value;
        return value !== removeValue;
      });
      var wrappedValue;

      if (_this.isLabelInValue()) {
        wrappedValue = {
          label: triggerNode ? triggerNode.props[treeNodeLabelProp] : null,
          value: removeValue
        };
      } else {
        wrappedValue = removeValue;
      }

      _this.onDeselect(wrappedValue, triggerNode, deselectInfo);

      _this.triggerChange(newMissValueList, newValueList, extraInfo);
    });

    _defineProperty(_assertThisInitialized(_this), "onValueTrigger", function (isAdd, nodeList, nodeEventInfo, nodeExtraInfo) {
      var node = nodeEventInfo.node;
      var value = node.props.value;
      var _this$state2 = _this.state,
          missValueList = _this$state2.missValueList,
          valueEntities = _this$state2.valueEntities,
          keyEntities = _this$state2.keyEntities,
          searchValue = _this$state2.searchValue;
      var _this$props2 = _this.props,
          disabled = _this$props2.disabled,
          inputValue = _this$props2.inputValue,
          treeNodeLabelProp = _this$props2.treeNodeLabelProp,
          onSelect = _this$props2.onSelect,
          onSearch = _this$props2.onSearch,
          multiple = _this$props2.multiple,
          treeCheckable = _this$props2.treeCheckable,
          treeCheckStrictly = _this$props2.treeCheckStrictly,
          autoClearSearchValue = _this$props2.autoClearSearchValue;
      var label = node.props[treeNodeLabelProp];
      if (disabled) return; // Wrap the return value for user

      var wrappedValue;

      if (_this.isLabelInValue()) {
        wrappedValue = {
          value: value,
          label: label
        };
      } else {
        wrappedValue = value;
      } // [Legacy] Origin code not trigger `onDeselect` every time. Let's align the behaviour.


      if (isAdd) {
        if (onSelect) {
          onSelect(wrappedValue, node, nodeEventInfo);
        }
      } else {
        _this.onDeselect(wrappedValue, node, nodeEventInfo);
      } // Get wrapped value list.
      // This is a bit hack cause we use key to match the value.


      var newValueList = nodeList.map(function (_ref9) {
        var props = _ref9.props;
        return {
          value: props.value,
          label: props[treeNodeLabelProp]
        };
      }); // When is `treeCheckable` and with `searchValue`, `valueList` is not full filled.
      // We need calculate the missing nodes.

      if (treeCheckable && !treeCheckStrictly) {
        var keyList = newValueList.map(function (_ref10) {
          var val = _ref10.value;
          return valueEntities[val].key;
        });

        if (isAdd) {
          keyList = (0, _util.conductCheck)(keyList, true, keyEntities).checkedKeys;
        } else {
          keyList = (0, _util.conductCheck)([valueEntities[value].key], false, keyEntities, {
            checkedKeys: keyList
          }).checkedKeys;
        }

        newValueList = keyList.map(function (key) {
          var props = keyEntities[key].node.props;
          return {
            value: props.value,
            label: props[treeNodeLabelProp]
          };
        });
      } // Clean up `searchValue` when this prop is set


      if (autoClearSearchValue || inputValue === null) {
        // Clean state `searchValue` if uncontrolled
        if (!_this.isSearchValueControlled() && (multiple || treeCheckable)) {
          _this.setUncontrolledState({
            searchValue: '',
            filteredTreeNodes: null
          });
        } // Trigger onSearch if `searchValue` to be empty.
        // We should also trigger onSearch with empty string here
        // since if user use `treeExpandedKeys`, it need user have the ability to reset it.


        if (onSearch && searchValue && searchValue.length) {
          onSearch('');
        }
      } // [Legacy] Provide extra info


      var extraInfo = _objectSpread({}, nodeExtraInfo, {
        triggerValue: value,
        triggerNode: node
      });

      _this.triggerChange(missValueList, newValueList, extraInfo);
    });

    _defineProperty(_assertThisInitialized(_this), "onTreeNodeSelect", function (_, nodeEventInfo) {
      var _this$state3 = _this.state,
          valueList = _this$state3.valueList,
          valueEntities = _this$state3.valueEntities;
      var _this$props3 = _this.props,
          treeCheckable = _this$props3.treeCheckable,
          multiple = _this$props3.multiple;
      if (treeCheckable) return;

      if (!multiple) {
        _this.setOpenState(false);
      }

      var isAdd = nodeEventInfo.selected;
      var selectedValue = nodeEventInfo.node.props.value;
      var newValueList;

      if (!multiple) {
        newValueList = [{
          value: selectedValue
        }];
      } else {
        newValueList = valueList.filter(function (_ref11) {
          var value = _ref11.value;
          return value !== selectedValue;
        });

        if (isAdd) {
          newValueList.push({
            value: selectedValue
          });
        }
      }

      var selectedNodes = newValueList.map(function (_ref12) {
        var value = _ref12.value;
        return valueEntities[value];
      }).filter(function (entity) {
        return entity;
      }).map(function (_ref13) {
        var node = _ref13.node;
        return node;
      });

      _this.onValueTrigger(isAdd, selectedNodes, nodeEventInfo, {
        selected: isAdd
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onTreeNodeCheck", function (_, nodeEventInfo) {
      var _this$state4 = _this.state,
          searchValue = _this$state4.searchValue,
          keyEntities = _this$state4.keyEntities,
          valueEntities = _this$state4.valueEntities,
          valueList = _this$state4.valueList;
      var treeCheckStrictly = _this.props.treeCheckStrictly;
      var checkedNodes = nodeEventInfo.checkedNodes,
          checkedNodesPositions = nodeEventInfo.checkedNodesPositions;
      var isAdd = nodeEventInfo.checked;
      var extraInfo = {
        checked: isAdd
      };
      var checkedNodeList = checkedNodes; // [Legacy] Check event provide `allCheckedNodes`.
      // When `treeCheckStrictly` or internal `searchValue` is set, TreeNode will be unrelated:
      // - Related: Show the top checked nodes and has children prop.
      // - Unrelated: Show all the checked nodes.

      if (searchValue) {
        var oriKeyList = valueList.map(function (_ref14) {
          var value = _ref14.value;
          return valueEntities[value];
        }).filter(function (entity) {
          return entity;
        }).map(function (_ref15) {
          var key = _ref15.key;
          return key;
        });
        var keyList;

        if (isAdd) {
          keyList = Array.from(new Set([].concat(_toConsumableArray(oriKeyList), _toConsumableArray(checkedNodeList.map(function (_ref16) {
            var value = _ref16.props.value;
            return valueEntities[value].key;
          })))));
        } else {
          keyList = (0, _util.conductCheck)([nodeEventInfo.node.props.eventKey], false, keyEntities, {
            checkedKeys: oriKeyList
          }).checkedKeys;
        }

        checkedNodeList = keyList.map(function (key) {
          return keyEntities[key].node;
        }); // Let's follow as not `treeCheckStrictly` format

        extraInfo.allCheckedNodes = keyList.map(function (key) {
          return (0, _util.cleanEntity)(keyEntities[key]);
        });
      } else if (treeCheckStrictly) {
        extraInfo.allCheckedNodes = nodeEventInfo.checkedNodes;
      } else {
        extraInfo.allCheckedNodes = (0, _util.flatToHierarchy)(checkedNodesPositions);
      }

      _this.onValueTrigger(isAdd, checkedNodeList, nodeEventInfo, extraInfo);
    });

    _defineProperty(_assertThisInitialized(_this), "onDropdownVisibleChange", function (open) {
      var _this$props4 = _this.props,
          multiple = _this$props4.multiple,
          treeCheckable = _this$props4.treeCheckable;
      var searchValue = _this.state.searchValue; // When set open success and single mode,
      // we will reset the input content.

      if (open && !multiple && !treeCheckable && searchValue) {
        _this.setUncontrolledState({
          searchValue: '',
          filteredTreeNodes: null
        });
      }

      _this.setOpenState(open, true);
    });

    _defineProperty(_assertThisInitialized(_this), "onSearchInputChange", function (_ref17) {
      var value = _ref17.target.value;
      var _this$state5 = _this.state,
          treeNodes = _this$state5.treeNodes,
          valueEntities = _this$state5.valueEntities;
      var _this$props5 = _this.props,
          onSearch = _this$props5.onSearch,
          filterTreeNode = _this$props5.filterTreeNode,
          treeNodeFilterProp = _this$props5.treeNodeFilterProp;

      if (onSearch) {
        onSearch(value);
      }

      var isSet = false;

      if (!_this.isSearchValueControlled()) {
        isSet = _this.setUncontrolledState({
          searchValue: value
        });

        _this.setOpenState(true);
      }

      if (isSet) {
        // Do the search logic
        var upperSearchValue = String(value).toUpperCase();
        var filterTreeNodeFn = filterTreeNode;

        if (filterTreeNode === false) {
          filterTreeNodeFn = function filterTreeNodeFn() {
            return true;
          };
        } else if (!filterTreeNodeFn) {
          filterTreeNodeFn = function filterTreeNodeFn(_, node) {
            var nodeValue = String(node.props[treeNodeFilterProp]).toUpperCase();
            return nodeValue.indexOf(upperSearchValue) !== -1;
          };
        }

        _this.setState({
          filteredTreeNodes: (0, _util.getFilterTree)(treeNodes, value, filterTreeNodeFn, valueEntities, _SelectNode["default"])
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onSearchInputKeyDown", function (event) {
      var _this$state6 = _this.state,
          searchValue = _this$state6.searchValue,
          valueList = _this$state6.valueList;
      var keyCode = event.keyCode;

      if (_KeyCode["default"].BACKSPACE === keyCode && _this.isMultiple() && !searchValue && valueList.length) {
        var lastValue = valueList[valueList.length - 1].value;

        _this.onMultipleSelectorRemove(event, lastValue);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onChoiceAnimationLeave", function () {
      (0, _raf["default"])(function () {
        _this.forcePopupAlign();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setPopupRef", function (popup) {
      _this.popup = popup;
    });

    _defineProperty(_assertThisInitialized(_this), "setUncontrolledState", function (state) {
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

      return needSync;
    });

    _defineProperty(_assertThisInitialized(_this), "setOpenState", function (open) {
      var byTrigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var onDropdownVisibleChange = _this.props.onDropdownVisibleChange;

      if (onDropdownVisibleChange && onDropdownVisibleChange(open, {
        documentClickClose: !open && byTrigger
      }) === false) {
        return;
      }

      _this.setUncontrolledState({
        open: open
      });
    });

    _defineProperty(_assertThisInitialized(_this), "isMultiple", function () {
      var _this$props6 = _this.props,
          multiple = _this$props6.multiple,
          treeCheckable = _this$props6.treeCheckable;
      return !!(multiple || treeCheckable);
    });

    _defineProperty(_assertThisInitialized(_this), "isLabelInValue", function () {
      return (0, _util.isLabelInValue)(_this.props);
    });

    _defineProperty(_assertThisInitialized(_this), "isSearchValueControlled", function () {
      var inputValue = _this.props.inputValue;
      if ('searchValue' in _this.props) return true;
      return 'inputValue' in _this.props && inputValue !== null;
    });

    _defineProperty(_assertThisInitialized(_this), "forcePopupAlign", function () {
      var $trigger = _this.selectTriggerRef.current;

      if ($trigger) {
        $trigger.forcePopupAlign();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "delayForcePopupAlign", function () {
      // Wait 2 frame to avoid dom update & dom algin in the same time
      // https://github.com/ant-design/ant-design/issues/12031
      (0, _raf["default"])(function () {
        (0, _raf["default"])(_this.forcePopupAlign);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "triggerChange", function (missValueList, valueList) {
      var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _this$state7 = _this.state,
          valueEntities = _this$state7.valueEntities,
          searchValue = _this$state7.searchValue,
          prevSelectorValueList = _this$state7.selectorValueList;
      var _this$props7 = _this.props,
          onChange = _this$props7.onChange,
          disabled = _this$props7.disabled,
          treeCheckable = _this$props7.treeCheckable,
          treeCheckStrictly = _this$props7.treeCheckStrictly;
      if (disabled) return; // Trigger

      var extra = _objectSpread({
        // [Legacy] Always return as array contains label & value
        preValue: prevSelectorValueList.map(function (_ref18) {
          var label = _ref18.label,
              value = _ref18.value;
          return {
            label: label,
            value: value
          };
        })
      }, extraInfo); // Format value by `treeCheckStrictly`


      var selectorValueList = (0, _util.formatSelectorValue)(valueList, _this.props, valueEntities);

      if (!('value' in _this.props)) {
        var newState = {
          missValueList: missValueList,
          valueList: valueList,
          selectorValueList: selectorValueList
        };

        if (searchValue && treeCheckable && !treeCheckStrictly) {
          newState.searchHalfCheckedKeys = (0, _util.getHalfCheckedKeys)(valueList, valueEntities);
        }

        _this.setState(newState);
      } // Only do the logic when `onChange` function provided


      if (onChange) {
        var connectValueList; // Get value by mode

        if (_this.isMultiple()) {
          connectValueList = [].concat(_toConsumableArray(missValueList), _toConsumableArray(selectorValueList));
        } else {
          connectValueList = selectorValueList.slice(0, 1);
        }

        var labelList = null;
        var returnValue;

        if (_this.isLabelInValue()) {
          returnValue = connectValueList.map(function (_ref19) {
            var label = _ref19.label,
                value = _ref19.value;
            return {
              label: label,
              value: value
            };
          });
        } else {
          labelList = [];
          returnValue = connectValueList.map(function (_ref20) {
            var label = _ref20.label,
                value = _ref20.value;
            labelList.push(label);
            return value;
          });
        }

        if (!_this.isMultiple()) {
          returnValue = returnValue[0];
        }

        onChange(returnValue, labelList, extra);
      }
    });

    var prefixAria = _props.prefixAria,
        defaultOpen = _props.defaultOpen,
        _open = _props.open;
    _this.state = {
      open: _open || defaultOpen,
      valueList: [],
      searchHalfCheckedKeys: [],
      missValueList: [],
      // Contains the value not in the tree
      selectorValueList: [],
      // Used for multiple selector
      valueEntities: {},
      keyEntities: {},
      searchValue: '',
      init: true
    };
    _this.selectorRef = (0, _util.createRef)();
    _this.selectTriggerRef = (0, _util.createRef)(); // ARIA need `aria-controls` props mapping
    // Since this need user input. Let's generate ourselves

    _this.ariaId = (0, _util.generateAriaId)("".concat(prefixAria, "-list"));
    return _this;
  }

  _createClass(Select, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        rcTreeSelect: {
          onSelectorFocus: this.onSelectorFocus,
          onSelectorBlur: this.onSelectorBlur,
          onSelectorKeyDown: this.onComponentKeyDown,
          onSelectorClear: this.onSelectorClear,
          onMultipleSelectorRemove: this.onMultipleSelectorRemove,
          onTreeNodeSelect: this.onTreeNodeSelect,
          onTreeNodeCheck: this.onTreeNodeCheck,
          onPopupKeyDown: this.onComponentKeyDown,
          onSearchInputChange: this.onSearchInputChange,
          onSearchInputKeyDown: this.onSearchInputKeyDown
        }
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props8 = this.props,
          autoFocus = _this$props8.autoFocus,
          disabled = _this$props8.disabled;

      if (autoFocus && !disabled) {
        this.focus();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_, prevState) {
      var _this2 = this;

      var prefixCls = this.props.prefixCls;
      var _this$state8 = this.state,
          valueList = _this$state8.valueList,
          open = _this$state8.open,
          selectorValueList = _this$state8.selectorValueList,
          valueEntities = _this$state8.valueEntities;
      var isMultiple = this.isMultiple();

      if (prevState.valueList !== valueList) {
        this.forcePopupAlign();
      } // Scroll to value position, only need sync on single mode


      if (!isMultiple && selectorValueList.length && !prevState.open && open && this.popup) {
        var value = selectorValueList[0].value;

        var _this$popup$getTree = this.popup.getTree(),
            domTreeNodes = _this$popup$getTree.domTreeNodes;

        var _ref21 = valueEntities[value] || {},
            key = _ref21.key;

        var treeNode = domTreeNodes[key];

        if (treeNode) {
          var domNode = (0, _reactDom.findDOMNode)(treeNode);
          (0, _raf["default"])(function () {
            var popupNode = (0, _reactDom.findDOMNode)(_this2.popup);
            var triggerContainer = (0, _util.findPopupContainer)(popupNode, "".concat(prefixCls, "-dropdown"));
            var searchNode = _this2.popup.searchRef.current;

            if (domNode && triggerContainer && searchNode) {
              (0, _domScrollIntoView["default"])(domNode, triggerContainer, {
                onlyScrollIfNeeded: true,
                offsetTop: searchNode.offsetHeight
              });
            }
          });
        }
      }
    } // ==================== Selector ====================

  }, {
    key: "focus",
    value: function focus() {
      this.selectorRef.current.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.selectorRef.current.blur();
    } // ===================== Render =====================

  }, {
    key: "render",
    value: function render() {
      var _this$state9 = this.state,
          valueList = _this$state9.valueList,
          missValueList = _this$state9.missValueList,
          selectorValueList = _this$state9.selectorValueList,
          searchHalfCheckedKeys = _this$state9.searchHalfCheckedKeys,
          valueEntities = _this$state9.valueEntities,
          keyEntities = _this$state9.keyEntities,
          searchValue = _this$state9.searchValue,
          open = _this$state9.open,
          focused = _this$state9.focused,
          treeNodes = _this$state9.treeNodes,
          filteredTreeNodes = _this$state9.filteredTreeNodes;
      var _this$props9 = this.props,
          prefixCls = _this$props9.prefixCls,
          treeExpandedKeys = _this$props9.treeExpandedKeys,
          onTreeExpand = _this$props9.onTreeExpand;
      var isMultiple = this.isMultiple();

      var passProps = _objectSpread({}, this.props, {
        isMultiple: isMultiple,
        valueList: valueList,
        searchHalfCheckedKeys: searchHalfCheckedKeys,
        selectorValueList: [].concat(_toConsumableArray(missValueList), _toConsumableArray(selectorValueList)),
        valueEntities: valueEntities,
        keyEntities: keyEntities,
        searchValue: searchValue,
        upperSearchValue: (searchValue || '').toUpperCase(),
        // Perf save
        open: open,
        focused: focused,
        onChoiceAnimationLeave: this.onChoiceAnimationLeave,
        dropdownPrefixCls: "".concat(prefixCls, "-dropdown"),
        ariaId: this.ariaId
      });

      var Popup = isMultiple ? _MultiplePopup["default"] : _SinglePopup["default"];

      var $popup = _react["default"].createElement(Popup, _extends({
        ref: this.setPopupRef
      }, passProps, {
        onTreeExpanded: this.delayForcePopupAlign,
        treeNodes: treeNodes,
        filteredTreeNodes: filteredTreeNodes // Tree expanded control
        ,
        treeExpandedKeys: treeExpandedKeys,
        onTreeExpand: onTreeExpand
      }));

      var Selector = isMultiple ? _MultipleSelector["default"] : _SingleSelector["default"];

      var $selector = _react["default"].createElement(Selector, _extends({}, passProps, {
        ref: this.selectorRef
      }));

      return _react["default"].createElement(_SelectTrigger["default"], _extends({}, passProps, {
        ref: this.selectTriggerRef,
        popupElement: $popup,
        onKeyDown: this.onKeyDown,
        onDropdownVisibleChange: this.onDropdownVisibleChange
      }), $selector);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var _prevState$prevProps = prevState.prevProps,
          prevProps = _prevState$prevProps === void 0 ? {} : _prevState$prevProps;
      var treeCheckable = nextProps.treeCheckable,
          treeCheckStrictly = nextProps.treeCheckStrictly,
          filterTreeNode = nextProps.filterTreeNode,
          treeNodeFilterProp = nextProps.treeNodeFilterProp,
          treeDataSimpleMode = nextProps.treeDataSimpleMode;
      var newState = {
        prevProps: nextProps,
        init: false
      }; // Process the state when props updated

      function processState(propName, updater) {
        if (prevProps[propName] !== nextProps[propName]) {
          updater(nextProps[propName], prevProps[propName]);
          return true;
        }

        return false;
      }

      var valueRefresh = false; // Open

      processState('open', function (propValue) {
        newState.open = propValue;
      }); // Tree Nodes

      var treeNodes;
      var treeDataChanged = false;
      var treeDataModeChanged = false;
      processState('treeData', function (propValue) {
        treeNodes = (0, _util.convertDataToTree)(propValue);
        treeDataChanged = true;
      });
      processState('treeDataSimpleMode', function (propValue, prevValue) {
        if (!propValue) return;
        var prev = !prevValue || prevValue === true ? {} : prevValue; // Shallow equal to avoid dynamic prop object

        if (!(0, _shallowequal["default"])(propValue, prev)) {
          treeDataModeChanged = true;
        }
      }); // Parse by `treeDataSimpleMode`

      if (treeDataSimpleMode && (treeDataChanged || treeDataModeChanged)) {
        var simpleMapper = _objectSpread({
          id: 'id',
          pId: 'pId',
          rootPId: null
        }, treeDataSimpleMode !== true ? treeDataSimpleMode : {});

        treeNodes = (0, _util.convertDataToTree)((0, _util.parseSimpleTreeData)(nextProps.treeData, simpleMapper));
      } // If `treeData` not provide, use children TreeNodes


      if (!nextProps.treeData) {
        processState('children', function (propValue) {
          treeNodes = Array.isArray(propValue) ? propValue : [propValue];
        });
      } // Convert `treeData` to entities


      if (treeNodes) {
        var entitiesMap = (0, _util.convertTreeToEntities)(treeNodes);
        newState.treeNodes = treeNodes;
        newState.posEntities = entitiesMap.posEntities;
        newState.valueEntities = entitiesMap.valueEntities;
        newState.keyEntities = entitiesMap.keyEntities;
        valueRefresh = true;
      } // Value List


      if (prevState.init) {
        processState('defaultValue', function (propValue) {
          newState.valueList = (0, _util.formatInternalValue)(propValue, nextProps);
          valueRefresh = true;
        });
      }

      processState('value', function (propValue) {
        newState.valueList = (0, _util.formatInternalValue)(propValue, nextProps);
        valueRefresh = true;
      }); // Selector Value List

      if (valueRefresh) {
        // Find out that value not exist in the tree
        var missValueList = [];
        var filteredValueList = [];
        var keyList = []; // Get latest value list

        var latestValueList = newState.valueList;

        if (!latestValueList) {
          // Also need add prev missValueList to avoid new treeNodes contains the value
          latestValueList = [].concat(_toConsumableArray(prevState.valueList), _toConsumableArray(prevState.missValueList));
        } // Get key by value


        latestValueList.forEach(function (wrapperValue) {
          var value = wrapperValue.value;
          var entity = (newState.valueEntities || prevState.valueEntities)[value];

          if (entity) {
            keyList.push(entity.key);
            filteredValueList.push(wrapperValue);
            return;
          } // If not match, it may caused by ajax load. We need keep this


          missValueList.push(wrapperValue);
        }); // We need calculate the value when tree is checked tree

        if (treeCheckable && !treeCheckStrictly) {
          // Calculate the keys need to be checked
          var _conductCheck = (0, _util.conductCheck)(keyList, true, newState.keyEntities || prevState.keyEntities),
              checkedKeys = _conductCheck.checkedKeys; // Format value list again for internal usage


          newState.valueList = checkedKeys.map(function (key) {
            return {
              value: (newState.keyEntities || prevState.keyEntities)[key].value
            };
          });
        } else {
          newState.valueList = filteredValueList;
        } // Fill the missValueList, we still need display in the selector


        newState.missValueList = missValueList; // Calculate the value list for `Selector` usage

        newState.selectorValueList = (0, _util.formatSelectorValue)(newState.valueList, nextProps, newState.valueEntities || prevState.valueEntities);
      } // [Legacy] To align with `Select` component,
      // We use `searchValue` instead of `inputValue` but still keep the api
      // `inputValue` support `null` to work as `autoClearSearchValue`


      processState('inputValue', function (propValue) {
        if (propValue !== null) {
          newState.searchValue = propValue;
        }
      }); // Search value

      processState('searchValue', function (propValue) {
        newState.searchValue = propValue;
      }); // Do the search logic

      if (newState.searchValue !== undefined || prevState.searchValue && treeNodes) {
        var searchValue = newState.searchValue !== undefined ? newState.searchValue : prevState.searchValue;
        var upperSearchValue = String(searchValue).toUpperCase();
        var filterTreeNodeFn = filterTreeNode;

        if (filterTreeNode === false) {
          // Don't filter if is false
          filterTreeNodeFn = function filterTreeNodeFn() {
            return true;
          };
        } else if (typeof filterTreeNodeFn !== 'function') {
          // When is not function (true or undefined), use inner filter
          filterTreeNodeFn = function filterTreeNodeFn(_, node) {
            var nodeValue = String(node.props[treeNodeFilterProp]).toUpperCase();
            return nodeValue.indexOf(upperSearchValue) !== -1;
          };
        }

        newState.filteredTreeNodes = (0, _util.getFilterTree)(newState.treeNodes || prevState.treeNodes, searchValue, filterTreeNodeFn, newState.valueEntities || prevState.valueEntities, _SelectNode["default"]);
      } // We should re-calculate the halfCheckedKeys when in search mode


      if (valueRefresh && treeCheckable && !treeCheckStrictly && (newState.searchValue || prevState.searchValue)) {
        newState.searchHalfCheckedKeys = (0, _util.getHalfCheckedKeys)(newState.valueList, newState.valueEntities || prevState.valueEntities);
      } // Checked Strategy


      processState('showCheckedStrategy', function () {
        newState.selectorValueList = newState.selectorValueList || (0, _util.formatSelectorValue)(newState.valueList || prevState.valueList, nextProps, newState.valueEntities || prevState.valueEntities);
      });
      return newState;
    }
  }]);

  return Select;
}(_react["default"].Component);

_defineProperty(Select, "propTypes", {
  prefixCls: _propTypes["default"].string,
  prefixAria: _propTypes["default"].string,
  multiple: _propTypes["default"].bool,
  showArrow: _propTypes["default"].bool,
  open: _propTypes["default"].bool,
  value: _propTypes2.valueProp,
  autoFocus: _propTypes["default"].bool,
  defaultOpen: _propTypes["default"].bool,
  defaultValue: _propTypes2.valueProp,
  showSearch: _propTypes["default"].bool,
  placeholder: _propTypes["default"].node,
  inputValue: _propTypes["default"].string,
  // [Legacy] Deprecated. Use `searchValue` instead.
  searchValue: _propTypes["default"].string,
  autoClearSearchValue: _propTypes["default"].bool,
  searchPlaceholder: _propTypes["default"].node,
  // [Legacy] Confuse with placeholder
  disabled: _propTypes["default"].bool,
  children: _propTypes["default"].node,
  labelInValue: _propTypes["default"].bool,
  maxTagCount: _propTypes["default"].number,
  maxTagPlaceholder: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].func]),
  maxTagTextLength: _propTypes["default"].number,
  showCheckedStrategy: _propTypes["default"].oneOf([_strategies.SHOW_ALL, _strategies.SHOW_PARENT, _strategies.SHOW_CHILD]),
  dropdownMatchSelectWidth: _propTypes["default"].bool,
  treeData: _propTypes["default"].array,
  treeDataSimpleMode: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].object]),
  treeNodeFilterProp: _propTypes["default"].string,
  treeNodeLabelProp: _propTypes["default"].string,
  treeCheckable: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].node]),
  treeCheckStrictly: _propTypes["default"].bool,
  treeIcon: _propTypes["default"].bool,
  treeLine: _propTypes["default"].bool,
  treeDefaultExpandAll: _propTypes["default"].bool,
  treeDefaultExpandedKeys: _propTypes["default"].array,
  treeExpandedKeys: _propTypes["default"].array,
  loadData: _propTypes["default"].func,
  filterTreeNode: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].bool]),
  notFoundContent: _propTypes["default"].node,
  onSearch: _propTypes["default"].func,
  onSelect: _propTypes["default"].func,
  onDeselect: _propTypes["default"].func,
  onChange: _propTypes["default"].func,
  onDropdownVisibleChange: _propTypes["default"].func,
  onTreeExpand: _propTypes["default"].func,
  inputIcon: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].func]),
  clearIcon: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].func]),
  removeIcon: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].func]),
  switcherIcon: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].func])
});

_defineProperty(Select, "childContextTypes", {
  rcTreeSelect: _propTypes["default"].shape(_objectSpread({}, _BaseSelector.selectorContextTypes, _MultipleSelector.multipleSelectorContextTypes, _BasePopup.popupContextTypes, {
    onSearchInputChange: _propTypes["default"].func,
    onSearchInputKeyDown: _propTypes["default"].func
  }))
});

_defineProperty(Select, "defaultProps", {
  prefixCls: 'rc-tree-select',
  prefixAria: 'rc-tree-select',
  showArrow: true,
  showSearch: true,
  autoClearSearchValue: true,
  showCheckedStrategy: _strategies.SHOW_CHILD,
  // dropdownMatchSelectWidth change the origin design, set to false now
  // ref: https://github.com/react-component/select/blob/4cad95e098a341a09de239ad6981067188842020/src/Select.jsx#L344
  // ref: https://github.com/react-component/select/pull/71
  treeNodeFilterProp: 'value',
  treeNodeLabelProp: 'title',
  treeIcon: false,
  notFoundContent: 'Not Found'
});

Select.TreeNode = _SelectNode["default"];
Select.SHOW_ALL = _strategies.SHOW_ALL;
Select.SHOW_PARENT = _strategies.SHOW_PARENT;
Select.SHOW_CHILD = _strategies.SHOW_CHILD; // Let warning show correct component name

Select.displayName = 'TreeSelect';
(0, _reactLifecyclesCompat.polyfill)(Select);
var _default = Select;
exports["default"] = _default;