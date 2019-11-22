'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _PanelContent = require('./PanelContent');

var _PanelContent2 = _interopRequireDefault(_PanelContent);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CollapsePanel = function (_Component) {
  _inherits(CollapsePanel, _Component);

  function CollapsePanel() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CollapsePanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CollapsePanel.__proto__ || Object.getPrototypeOf(CollapsePanel)).call.apply(_ref, [this].concat(args))), _this), _this.handleItemClick = function () {
      var _this$props = _this.props,
          onItemClick = _this$props.onItemClick,
          panelKey = _this$props.panelKey;


      if (typeof onItemClick === 'function') {
        onItemClick(panelKey);
      }
    }, _this.handleKeyPress = function (e) {
      if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
        _this.handleItemClick();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CollapsePanel, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !(0, _shallowequal2['default'])(this.props, nextProps);
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames2;

      var _props = this.props,
          className = _props.className,
          id = _props.id,
          style = _props.style,
          prefixCls = _props.prefixCls,
          header = _props.header,
          headerClass = _props.headerClass,
          children = _props.children,
          isActive = _props.isActive,
          showArrow = _props.showArrow,
          destroyInactivePanel = _props.destroyInactivePanel,
          disabled = _props.disabled,
          accordion = _props.accordion,
          forceRender = _props.forceRender,
          expandIcon = _props.expandIcon,
          extra = _props.extra;

      var headerCls = (0, _classnames2['default'])(prefixCls + '-header', _defineProperty({}, headerClass, headerClass));
      var itemCls = (0, _classnames2['default'])((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-item', true), _defineProperty(_classNames2, prefixCls + '-item-active', isActive), _defineProperty(_classNames2, prefixCls + '-item-disabled', disabled), _classNames2), className);

      var icon = _react2['default'].createElement('i', { className: 'arrow' });
      if (showArrow && typeof expandIcon === 'function') {
        icon = expandIcon(this.props);
      }
      return _react2['default'].createElement(
        'div',
        { className: itemCls, style: style, id: id },
        _react2['default'].createElement(
          'div',
          {
            className: headerCls,
            onClick: this.handleItemClick,
            role: accordion ? 'tab' : 'button',
            tabIndex: disabled ? -1 : 0,
            'aria-expanded': '' + isActive,
            onKeyPress: this.handleKeyPress
          },
          showArrow && icon,
          header,
          extra && _react2['default'].createElement(
            'div',
            { className: prefixCls + '-extra' },
            extra
          )
        ),
        _react2['default'].createElement(
          _rcAnimate2['default'],
          {
            showProp: 'isActive',
            exclusive: true,
            component: '',
            animation: this.props.openAnimation
          },
          _react2['default'].createElement(
            _PanelContent2['default'],
            {
              prefixCls: prefixCls,
              isActive: isActive,
              destroyInactivePanel: destroyInactivePanel,
              forceRender: forceRender,
              role: accordion ? 'tabpanel' : null
            },
            children
          )
        )
      );
    }
  }]);

  return CollapsePanel;
}(_react.Component);

CollapsePanel.propTypes = {
  className: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].object]),
  id: _propTypes2['default'].string,
  children: _propTypes2['default'].any,
  openAnimation: _propTypes2['default'].object,
  prefixCls: _propTypes2['default'].string,
  header: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number, _propTypes2['default'].node]),
  headerClass: _propTypes2['default'].string,
  showArrow: _propTypes2['default'].bool,
  isActive: _propTypes2['default'].bool,
  onItemClick: _propTypes2['default'].func,
  style: _propTypes2['default'].object,
  destroyInactivePanel: _propTypes2['default'].bool,
  disabled: _propTypes2['default'].bool,
  accordion: _propTypes2['default'].bool,
  forceRender: _propTypes2['default'].bool,
  expandIcon: _propTypes2['default'].func,
  extra: _propTypes2['default'].node,
  panelKey: _propTypes2['default'].any
};

CollapsePanel.defaultProps = {
  showArrow: true,
  isActive: false,
  destroyInactivePanel: false,
  onItemClick: function onItemClick() {},

  headerClass: '',
  forceRender: false
};

exports['default'] = CollapsePanel;
module.exports = exports['default'];