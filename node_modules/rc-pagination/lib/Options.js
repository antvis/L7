'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _KeyCode = require('./KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Options = function (_React$Component) {
  (0, _inherits3['default'])(Options, _React$Component);

  function Options() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Options);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Options.__proto__ || Object.getPrototypeOf(Options)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      goInputText: ''
    }, _this.buildOptionText = function (value) {
      return value + ' ' + _this.props.locale.items_per_page;
    }, _this.changeSize = function (value) {
      _this.props.changeSize(Number(value));
    }, _this.handleChange = function (e) {
      _this.setState({
        goInputText: e.target.value
      });
    }, _this.handleBlur = function () {
      var _this$props = _this.props,
          goButton = _this$props.goButton,
          quickGo = _this$props.quickGo;

      if (goButton) {
        return;
      }
      quickGo(_this.getValidValue());
    }, _this.go = function (e) {
      var goInputText = _this.state.goInputText;

      if (goInputText === '') {
        return;
      }
      if (e.keyCode === _KeyCode2['default'].ENTER || e.type === 'click') {
        _this.setState({
          goInputText: ''
        });
        _this.props.quickGo(_this.getValidValue());
      }
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Options, [{
    key: 'getValidValue',
    value: function getValidValue() {
      var _state = this.state,
          goInputText = _state.goInputText,
          current = _state.current;

      return !goInputText || isNaN(goInputText) ? current : Number(goInputText);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          pageSize = _props.pageSize,
          pageSizeOptions = _props.pageSizeOptions,
          locale = _props.locale,
          rootPrefixCls = _props.rootPrefixCls,
          changeSize = _props.changeSize,
          quickGo = _props.quickGo,
          goButton = _props.goButton,
          selectComponentClass = _props.selectComponentClass,
          buildOptionText = _props.buildOptionText,
          selectPrefixCls = _props.selectPrefixCls,
          disabled = _props.disabled;
      var goInputText = this.state.goInputText;

      var prefixCls = rootPrefixCls + '-options';
      var Select = selectComponentClass;
      var changeSelect = null;
      var goInput = null;
      var gotoButton = null;

      if (!changeSize && !quickGo) {
        return null;
      }

      if (changeSize && Select) {
        var options = pageSizeOptions.map(function (opt, i) {
          return _react2['default'].createElement(
            Select.Option,
            { key: i, value: opt },
            (buildOptionText || _this2.buildOptionText)(opt)
          );
        });

        changeSelect = _react2['default'].createElement(
          Select,
          {
            disabled: disabled,
            prefixCls: selectPrefixCls,
            showSearch: false,
            className: prefixCls + '-size-changer',
            optionLabelProp: 'children',
            dropdownMatchSelectWidth: false,
            value: (pageSize || pageSizeOptions[0]).toString(),
            onChange: this.changeSize,
            getPopupContainer: function getPopupContainer(triggerNode) {
              return triggerNode.parentNode;
            }
          },
          options
        );
      }

      if (quickGo) {
        if (goButton) {
          gotoButton = typeof goButton === 'boolean' ? _react2['default'].createElement(
            'button',
            {
              type: 'button',
              onClick: this.go,
              onKeyUp: this.go,
              disabled: disabled
            },
            locale.jump_to_confirm
          ) : _react2['default'].createElement(
            'span',
            {
              onClick: this.go,
              onKeyUp: this.go
            },
            goButton
          );
        }
        goInput = _react2['default'].createElement(
          'div',
          { className: prefixCls + '-quick-jumper' },
          locale.jump_to,
          _react2['default'].createElement('input', {
            disabled: disabled,
            type: 'text',
            value: goInputText,
            onChange: this.handleChange,
            onKeyUp: this.go,
            onBlur: this.handleBlur
          }),
          locale.page,
          gotoButton
        );
      }

      return _react2['default'].createElement(
        'li',
        { className: '' + prefixCls },
        changeSelect,
        goInput
      );
    }
  }]);
  return Options;
}(_react2['default'].Component);

Options.propTypes = {
  disabled: _propTypes2['default'].bool,
  changeSize: _propTypes2['default'].func,
  quickGo: _propTypes2['default'].func,
  selectComponentClass: _propTypes2['default'].func,
  current: _propTypes2['default'].number,
  pageSizeOptions: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  pageSize: _propTypes2['default'].number,
  buildOptionText: _propTypes2['default'].func,
  locale: _propTypes2['default'].object,
  rootPrefixCls: _propTypes2['default'].string,
  selectPrefixCls: _propTypes2['default'].string,
  goButton: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].node])
};
Options.defaultProps = {
  pageSizeOptions: ['10', '20', '30', '40']
};
exports['default'] = Options;
module.exports = exports['default'];