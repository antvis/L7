'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _rcTrigger = require('rc-trigger');

var _rcTrigger2 = _interopRequireDefault(_rcTrigger);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _KeyCode = require('rc-util/lib/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _arrayTreeFilter = require('array-tree-filter');

var _arrayTreeFilter2 = _interopRequireDefault(_arrayTreeFilter);

var _arrays = require('shallow-equal/arrays');

var _arrays2 = _interopRequireDefault(_arrays);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _Menus = require('./Menus');

var _Menus2 = _interopRequireDefault(_Menus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  }
};

var Cascader = function (_Component) {
  _inherits(Cascader, _Component);

  function Cascader(props) {
    _classCallCheck(this, Cascader);

    var _this = _possibleConstructorReturn(this, (Cascader.__proto__ || Object.getPrototypeOf(Cascader)).call(this, props));

    _this.setPopupVisible = function (popupVisible) {
      if (!('popupVisible' in _this.props)) {
        _this.setState({ popupVisible: popupVisible });
      }
      // sync activeValue with value when panel open
      if (popupVisible && !_this.state.popupVisible) {
        _this.setState({
          activeValue: _this.state.value
        });
      }
      _this.props.onPopupVisibleChange(popupVisible);
    };

    _this.handleChange = function (options, setProps, e) {
      if (e.type !== 'keydown' || e.keyCode === _KeyCode2['default'].ENTER) {
        _this.props.onChange(options.map(function (o) {
          return o[_this.getFieldName('value')];
        }), options);
        _this.setPopupVisible(setProps.visible);
      }
    };

    _this.handlePopupVisibleChange = function (popupVisible) {
      _this.setPopupVisible(popupVisible);
    };

    _this.handleMenuSelect = function (targetOption, menuIndex, e) {
      // Keep focused state for keyboard support
      var triggerNode = _this.trigger.getRootDomNode();
      if (triggerNode && triggerNode.focus) {
        triggerNode.focus();
      }
      var _this$props = _this.props,
          changeOnSelect = _this$props.changeOnSelect,
          loadData = _this$props.loadData,
          expandTrigger = _this$props.expandTrigger;

      if (!targetOption || targetOption.disabled) {
        return;
      }
      var activeValue = _this.state.activeValue;

      activeValue = activeValue.slice(0, menuIndex + 1);
      activeValue[menuIndex] = targetOption[_this.getFieldName('value')];
      var activeOptions = _this.getActiveOptions(activeValue);
      if (targetOption.isLeaf === false && !targetOption[_this.getFieldName('children')] && loadData) {
        if (changeOnSelect) {
          _this.handleChange(activeOptions, { visible: true }, e);
        }
        _this.setState({ activeValue: activeValue });
        loadData(activeOptions);
        return;
      }
      var newState = {};
      if (!targetOption[_this.getFieldName('children')] || !targetOption[_this.getFieldName('children')].length) {
        _this.handleChange(activeOptions, { visible: false }, e);
        // set value to activeValue when select leaf option
        newState.value = activeValue;
        // add e.type judgement to prevent `onChange` being triggered by mouseEnter
      } else if (changeOnSelect && (e.type === 'click' || e.type === 'keydown')) {
        if (expandTrigger === 'hover') {
          _this.handleChange(activeOptions, { visible: false }, e);
        } else {
          _this.handleChange(activeOptions, { visible: true }, e);
        }
        // set value to activeValue on every select
        newState.value = activeValue;
      }
      newState.activeValue = activeValue;
      //  not change the value by keyboard
      if ('value' in _this.props || e.type === 'keydown' && e.keyCode !== _KeyCode2['default'].ENTER) {
        delete newState.value;
      }
      _this.setState(newState);
    };

    _this.handleItemDoubleClick = function () {
      var changeOnSelect = _this.props.changeOnSelect;

      if (changeOnSelect) {
        _this.setPopupVisible(false);
      }
    };

    _this.handleKeyDown = function (e) {
      var children = _this.props.children;
      // https://github.com/ant-design/ant-design/issues/6717
      // Don't bind keyboard support when children specify the onKeyDown

      if (children && children.props.onKeyDown) {
        children.props.onKeyDown(e);
        return;
      }
      var activeValue = [].concat(_toConsumableArray(_this.state.activeValue));
      var currentLevel = activeValue.length - 1 < 0 ? 0 : activeValue.length - 1;
      var currentOptions = _this.getCurrentLevelOptions();
      var currentIndex = currentOptions.map(function (o) {
        return o[_this.getFieldName('value')];
      }).indexOf(activeValue[currentLevel]);
      if (e.keyCode !== _KeyCode2['default'].DOWN && e.keyCode !== _KeyCode2['default'].UP && e.keyCode !== _KeyCode2['default'].LEFT && e.keyCode !== _KeyCode2['default'].RIGHT && e.keyCode !== _KeyCode2['default'].ENTER && e.keyCode !== _KeyCode2['default'].SPACE && e.keyCode !== _KeyCode2['default'].BACKSPACE && e.keyCode !== _KeyCode2['default'].ESC && e.keyCode !== _KeyCode2['default'].TAB) {
        return;
      }
      // Press any keys above to reopen menu
      if (!_this.state.popupVisible && e.keyCode !== _KeyCode2['default'].BACKSPACE && e.keyCode !== _KeyCode2['default'].LEFT && e.keyCode !== _KeyCode2['default'].RIGHT && e.keyCode !== _KeyCode2['default'].ESC && e.keyCode !== _KeyCode2['default'].TAB) {
        _this.setPopupVisible(true);
        return;
      }
      if (e.keyCode === _KeyCode2['default'].DOWN || e.keyCode === _KeyCode2['default'].UP) {
        e.preventDefault();
        var nextIndex = currentIndex;
        if (nextIndex !== -1) {
          if (e.keyCode === _KeyCode2['default'].DOWN) {
            nextIndex += 1;
            nextIndex = nextIndex >= currentOptions.length ? 0 : nextIndex;
          } else {
            nextIndex -= 1;
            nextIndex = nextIndex < 0 ? currentOptions.length - 1 : nextIndex;
          }
        } else {
          nextIndex = 0;
        }
        activeValue[currentLevel] = currentOptions[nextIndex][_this.getFieldName('value')];
      } else if (e.keyCode === _KeyCode2['default'].LEFT || e.keyCode === _KeyCode2['default'].BACKSPACE) {
        e.preventDefault();
        activeValue.splice(activeValue.length - 1, 1);
      } else if (e.keyCode === _KeyCode2['default'].RIGHT) {
        e.preventDefault();
        if (currentOptions[currentIndex] && currentOptions[currentIndex][_this.getFieldName('children')]) {
          activeValue.push(currentOptions[currentIndex][_this.getFieldName('children')][0][_this.getFieldName('value')]);
        }
      } else if (e.keyCode === _KeyCode2['default'].ESC || e.keyCode === _KeyCode2['default'].TAB) {
        _this.setPopupVisible(false);
        return;
      }
      if (!activeValue || activeValue.length === 0) {
        _this.setPopupVisible(false);
      }
      var activeOptions = _this.getActiveOptions(activeValue);
      var targetOption = activeOptions[activeOptions.length - 1];
      _this.handleMenuSelect(targetOption, activeOptions.length - 1, e);

      if (_this.props.onKeyDown) {
        _this.props.onKeyDown(e);
      }
    };

    _this.saveTrigger = function (node) {
      _this.trigger = node;
    };

    var initialValue = [];
    if ('value' in props) {
      initialValue = props.value || [];
    } else if ('defaultValue' in props) {
      initialValue = props.defaultValue || [];
    }

    (0, _warning2['default'])(!('filedNames' in props), '`filedNames` of Cascader is a typo usage and deprecated, please use `fieldNames` instead.');

    _this.state = {
      popupVisible: props.popupVisible,
      activeValue: initialValue,
      value: initialValue,
      prevProps: props
    };
    _this.defaultFieldNames = { label: 'label', value: 'value', children: 'children' };
    return _this;
  }

  _createClass(Cascader, [{
    key: 'getPopupDOMNode',
    value: function getPopupDOMNode() {
      return this.trigger.getPopupDomNode();
    }
  }, {
    key: 'getFieldName',
    value: function getFieldName(name) {
      var defaultFieldNames = this.defaultFieldNames;
      var _props = this.props,
          fieldNames = _props.fieldNames,
          filedNames = _props.filedNames;

      if ('filedNames' in this.props) {
        return filedNames[name] || defaultFieldNames[name]; // For old compatibility
      }
      return fieldNames[name] || defaultFieldNames[name];
    }
  }, {
    key: 'getFieldNames',
    value: function getFieldNames() {
      var _props2 = this.props,
          fieldNames = _props2.fieldNames,
          filedNames = _props2.filedNames;

      if ('filedNames' in this.props) {
        return filedNames; // For old compatibility
      }
      return fieldNames;
    }
  }, {
    key: 'getCurrentLevelOptions',
    value: function getCurrentLevelOptions() {
      var _this2 = this;

      var _props$options = this.props.options,
          options = _props$options === undefined ? [] : _props$options;
      var _state$activeValue = this.state.activeValue,
          activeValue = _state$activeValue === undefined ? [] : _state$activeValue;

      var result = (0, _arrayTreeFilter2['default'])(options, function (o, level) {
        return o[_this2.getFieldName('value')] === activeValue[level];
      }, { childrenKeyName: this.getFieldName('children') });
      if (result[result.length - 2]) {
        return result[result.length - 2][this.getFieldName('children')];
      }
      return [].concat(_toConsumableArray(options)).filter(function (o) {
        return !o.disabled;
      });
    }
  }, {
    key: 'getActiveOptions',
    value: function getActiveOptions(activeValue) {
      var _this3 = this;

      return (0, _arrayTreeFilter2['default'])(this.props.options || [], function (o, level) {
        return o[_this3.getFieldName('value')] === activeValue[level];
      }, { childrenKeyName: this.getFieldName('children') });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          prefixCls = _props3.prefixCls,
          transitionName = _props3.transitionName,
          popupClassName = _props3.popupClassName,
          _props3$options = _props3.options,
          options = _props3$options === undefined ? [] : _props3$options,
          disabled = _props3.disabled,
          builtinPlacements = _props3.builtinPlacements,
          popupPlacement = _props3.popupPlacement,
          children = _props3.children,
          restProps = _objectWithoutProperties(_props3, ['prefixCls', 'transitionName', 'popupClassName', 'options', 'disabled', 'builtinPlacements', 'popupPlacement', 'children']);
      // Did not show popup when there is no options


      var menus = _react2['default'].createElement('div', null);
      var emptyMenuClassName = '';
      if (options && options.length > 0) {
        menus = _react2['default'].createElement(_Menus2['default'], _extends({}, this.props, {
          fieldNames: this.getFieldNames(),
          defaultFieldNames: this.defaultFieldNames,
          activeValue: this.state.activeValue,
          onSelect: this.handleMenuSelect,
          onItemDoubleClick: this.handleItemDoubleClick,
          visible: this.state.popupVisible
        }));
      } else {
        emptyMenuClassName = ' ' + prefixCls + '-menus-empty';
      }
      return _react2['default'].createElement(
        _rcTrigger2['default'],
        _extends({
          ref: this.saveTrigger
        }, restProps, {
          options: options,
          disabled: disabled,
          popupPlacement: popupPlacement,
          builtinPlacements: builtinPlacements,
          popupTransitionName: transitionName,
          action: disabled ? [] : ['click'],
          popupVisible: disabled ? false : this.state.popupVisible,
          onPopupVisibleChange: this.handlePopupVisibleChange,
          prefixCls: prefixCls + '-menus',
          popupClassName: popupClassName + emptyMenuClassName,
          popup: menus
        }),
        (0, _react.cloneElement)(children, {
          onKeyDown: this.handleKeyDown,
          tabIndex: disabled ? undefined : 0
        })
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var _prevState$prevProps = prevState.prevProps,
          prevProps = _prevState$prevProps === undefined ? {} : _prevState$prevProps;

      var newState = {
        prevProps: nextProps
      };

      if ('value' in nextProps && !(0, _arrays2['default'])(prevProps.value, nextProps.value)) {
        newState.value = nextProps.value || [];

        // allow activeValue diff from value
        // https://github.com/ant-design/ant-design/issues/2767
        if (!('loadData' in nextProps)) {
          newState.activeValue = nextProps.value || [];
        }
      }
      if ('popupVisible' in nextProps) {
        newState.popupVisible = nextProps.popupVisible;
      }

      return newState;
    }
  }]);

  return Cascader;
}(_react.Component);

Cascader.defaultProps = {
  onChange: function onChange() {},
  onPopupVisibleChange: function onPopupVisibleChange() {},

  disabled: false,
  transitionName: '',
  prefixCls: 'rc-cascader',
  popupClassName: '',
  popupPlacement: 'bottomLeft',
  builtinPlacements: BUILT_IN_PLACEMENTS,
  expandTrigger: 'click',
  fieldNames: { label: 'label', value: 'value', children: 'children' },
  expandIcon: '>'
};

Cascader.propTypes = {
  value: _propTypes2['default'].array,
  defaultValue: _propTypes2['default'].array,
  options: _propTypes2['default'].array.isRequired,
  onChange: _propTypes2['default'].func,
  onPopupVisibleChange: _propTypes2['default'].func,
  popupVisible: _propTypes2['default'].bool,
  disabled: _propTypes2['default'].bool,
  transitionName: _propTypes2['default'].string,
  popupClassName: _propTypes2['default'].string,
  popupPlacement: _propTypes2['default'].string,
  prefixCls: _propTypes2['default'].string,
  dropdownMenuColumnStyle: _propTypes2['default'].object,
  builtinPlacements: _propTypes2['default'].object,
  loadData: _propTypes2['default'].func,
  changeOnSelect: _propTypes2['default'].bool,
  children: _propTypes2['default'].node,
  onKeyDown: _propTypes2['default'].func,
  expandTrigger: _propTypes2['default'].string,
  fieldNames: _propTypes2['default'].object,
  filedNames: _propTypes2['default'].object, // typo but for compatibility
  expandIcon: _propTypes2['default'].node,
  loadingIcon: _propTypes2['default'].node
};

(0, _reactLifecyclesCompat.polyfill)(Cascader);

exports['default'] = Cascader;
module.exports = exports['default'];