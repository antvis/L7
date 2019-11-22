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

var _arrayTreeFilter = require('array-tree-filter');

var _arrayTreeFilter2 = _interopRequireDefault(_arrayTreeFilter);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Menus = function (_React$Component) {
  _inherits(Menus, _React$Component);

  function Menus(props) {
    _classCallCheck(this, Menus);

    var _this = _possibleConstructorReturn(this, (Menus.__proto__ || Object.getPrototypeOf(Menus)).call(this, props));

    _this.saveMenuItem = function (index) {
      return function (node) {
        _this.menuItems[index] = node;
      };
    };

    _this.menuItems = {};
    return _this;
  }

  _createClass(Menus, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.scrollActiveItemToView();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (!prevProps.visible && this.props.visible) {
        this.scrollActiveItemToView();
      }
    }
  }, {
    key: 'getFieldName',
    value: function getFieldName(name) {
      var _props = this.props,
          fieldNames = _props.fieldNames,
          defaultFieldNames = _props.defaultFieldNames;
      // 防止只设置单个属性的名字

      return fieldNames[name] || defaultFieldNames[name];
    }
  }, {
    key: 'getOption',
    value: function getOption(option, menuIndex) {
      var _props2 = this.props,
          prefixCls = _props2.prefixCls,
          expandTrigger = _props2.expandTrigger,
          expandIcon = _props2.expandIcon,
          loadingIcon = _props2.loadingIcon;

      var onSelect = this.props.onSelect.bind(this, option, menuIndex);
      var onItemDoubleClick = this.props.onItemDoubleClick.bind(this, option, menuIndex);
      var expandProps = {
        onClick: onSelect,
        onDoubleClick: onItemDoubleClick
      };
      var menuItemCls = prefixCls + '-menu-item';
      var expandIconNode = null;
      var hasChildren = option[this.getFieldName('children')] && option[this.getFieldName('children')].length > 0;
      if (hasChildren || option.isLeaf === false) {
        menuItemCls += ' ' + prefixCls + '-menu-item-expand';
        if (!option.loading) {
          expandIconNode = _react2['default'].createElement(
            'span',
            { className: prefixCls + '-menu-item-expand-icon' },
            expandIcon
          );
        }
      }
      if (expandTrigger === 'hover' && (hasChildren || option.isLeaf === false)) {
        expandProps = {
          onMouseEnter: this.delayOnSelect.bind(this, onSelect),
          onMouseLeave: this.delayOnSelect.bind(this),
          onClick: onSelect
        };
      }
      if (this.isActiveOption(option, menuIndex)) {
        menuItemCls += ' ' + prefixCls + '-menu-item-active';
        expandProps.ref = this.saveMenuItem(menuIndex);
      }
      if (option.disabled) {
        menuItemCls += ' ' + prefixCls + '-menu-item-disabled';
      }

      var loadingIconNode = null;
      if (option.loading) {
        menuItemCls += ' ' + prefixCls + '-menu-item-loading';
        loadingIconNode = loadingIcon || null;
      }

      var title = '';
      if ('title' in option) {
        title = option.title;
      } else if (typeof option[this.getFieldName('label')] === 'string') {
        title = option[this.getFieldName('label')];
      }

      return _react2['default'].createElement(
        'li',
        _extends({
          key: option[this.getFieldName('value')],
          className: menuItemCls,
          title: title
        }, expandProps, {
          role: 'menuitem',
          onMouseDown: function onMouseDown(e) {
            return e.preventDefault();
          }
        }),
        option[this.getFieldName('label')],
        expandIconNode,
        loadingIconNode
      );
    }
  }, {
    key: 'getActiveOptions',
    value: function getActiveOptions(values) {
      var _this2 = this;

      var activeValue = values || this.props.activeValue;
      var options = this.props.options;
      return (0, _arrayTreeFilter2['default'])(options, function (o, level) {
        return o[_this2.getFieldName('value')] === activeValue[level];
      }, { childrenKeyName: this.getFieldName('children') });
    }
  }, {
    key: 'getShowOptions',
    value: function getShowOptions() {
      var _this3 = this;

      var options = this.props.options;

      var result = this.getActiveOptions().map(function (activeOption) {
        return activeOption[_this3.getFieldName('children')];
      }).filter(function (activeOption) {
        return !!activeOption;
      });
      result.unshift(options);
      return result;
    }
  }, {
    key: 'delayOnSelect',
    value: function delayOnSelect(onSelect) {
      var _this4 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
      if (typeof onSelect === 'function') {
        this.delayTimer = setTimeout(function () {
          onSelect(args);
          _this4.delayTimer = null;
        }, 150);
      }
    }
  }, {
    key: 'scrollActiveItemToView',
    value: function scrollActiveItemToView() {
      // scroll into view
      var optionsLength = this.getShowOptions().length;
      for (var i = 0; i < optionsLength; i++) {
        var itemComponent = this.menuItems[i];
        if (itemComponent) {
          var target = (0, _reactDom.findDOMNode)(itemComponent);
          target.parentNode.scrollTop = target.offsetTop;
        }
      }
    }
  }, {
    key: 'isActiveOption',
    value: function isActiveOption(option, menuIndex) {
      var _props$activeValue = this.props.activeValue,
          activeValue = _props$activeValue === undefined ? [] : _props$activeValue;

      return activeValue[menuIndex] === option[this.getFieldName('value')];
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props3 = this.props,
          prefixCls = _props3.prefixCls,
          dropdownMenuColumnStyle = _props3.dropdownMenuColumnStyle;

      return _react2['default'].createElement(
        'div',
        null,
        this.getShowOptions().map(function (options, menuIndex) {
          return _react2['default'].createElement(
            'ul',
            { className: prefixCls + '-menu', key: menuIndex, style: dropdownMenuColumnStyle },
            options.map(function (option) {
              return _this5.getOption(option, menuIndex);
            })
          );
        })
      );
    }
  }]);

  return Menus;
}(_react2['default'].Component);

Menus.defaultProps = {
  options: [],
  value: [],
  activeValue: [],
  onSelect: function onSelect() {},

  prefixCls: 'rc-cascader-menus',
  visible: false,
  expandTrigger: 'click'
};

Menus.propTypes = {
  value: _propTypes2['default'].array,
  activeValue: _propTypes2['default'].array,
  options: _propTypes2['default'].array,
  prefixCls: _propTypes2['default'].string,
  expandTrigger: _propTypes2['default'].string,
  onSelect: _propTypes2['default'].func,
  visible: _propTypes2['default'].bool,
  dropdownMenuColumnStyle: _propTypes2['default'].object,
  defaultFieldNames: _propTypes2['default'].object,
  fieldNames: _propTypes2['default'].object,
  expandIcon: _propTypes2['default'].node,
  loadingIcon: _propTypes2['default'].node,
  onItemDoubleClick: _propTypes2['default'].func
};

exports['default'] = Menus;
module.exports = exports['default'];