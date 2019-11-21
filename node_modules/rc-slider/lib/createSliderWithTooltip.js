'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports['default'] = createSliderWithTooltip;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _rcTooltip = require('rc-tooltip');

var _rcTooltip2 = _interopRequireDefault(_rcTooltip);

var _Handle = require('./Handle');

var _Handle2 = _interopRequireDefault(_Handle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function createSliderWithTooltip(Component) {
  var _class, _temp2;

  return _temp2 = _class = function (_React$Component) {
    (0, _inherits3['default'])(ComponentWrapper, _React$Component);

    function ComponentWrapper() {
      var _ref;

      var _temp, _this, _ret;

      (0, _classCallCheck3['default'])(this, ComponentWrapper);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = ComponentWrapper.__proto__ || Object.getPrototypeOf(ComponentWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        visibles: {}
      }, _this.handleTooltipVisibleChange = function (index, visible) {
        _this.setState(function (prevState) {
          return {
            visibles: (0, _extends4['default'])({}, prevState.visibles, (0, _defineProperty3['default'])({}, index, visible))
          };
        });
      }, _this.handleWithTooltip = function (_ref2) {
        var value = _ref2.value,
            dragging = _ref2.dragging,
            index = _ref2.index,
            disabled = _ref2.disabled,
            restProps = (0, _objectWithoutProperties3['default'])(_ref2, ['value', 'dragging', 'index', 'disabled']);
        var _this$props = _this.props,
            tipFormatter = _this$props.tipFormatter,
            tipProps = _this$props.tipProps,
            handleStyle = _this$props.handleStyle;
        var _tipProps$prefixCls = tipProps.prefixCls,
            prefixCls = _tipProps$prefixCls === undefined ? 'rc-slider-tooltip' : _tipProps$prefixCls,
            _tipProps$overlay = tipProps.overlay,
            overlay = _tipProps$overlay === undefined ? tipFormatter(value) : _tipProps$overlay,
            _tipProps$placement = tipProps.placement,
            placement = _tipProps$placement === undefined ? 'top' : _tipProps$placement,
            _tipProps$visible = tipProps.visible,
            visible = _tipProps$visible === undefined ? false : _tipProps$visible,
            restTooltipProps = (0, _objectWithoutProperties3['default'])(tipProps, ['prefixCls', 'overlay', 'placement', 'visible']);


        var handleStyleWithIndex = void 0;
        if (Array.isArray(handleStyle)) {
          handleStyleWithIndex = handleStyle[index] || handleStyle[0];
        } else {
          handleStyleWithIndex = handleStyle;
        }

        return _react2['default'].createElement(
          _rcTooltip2['default'],
          (0, _extends4['default'])({}, restTooltipProps, {
            prefixCls: prefixCls,
            overlay: overlay,
            placement: placement,
            visible: !disabled && (_this.state.visibles[index] || dragging) || visible,
            key: index
          }),
          _react2['default'].createElement(_Handle2['default'], (0, _extends4['default'])({}, restProps, {
            style: (0, _extends4['default'])({}, handleStyleWithIndex),
            value: value,
            onMouseEnter: function onMouseEnter() {
              return _this.handleTooltipVisibleChange(index, true);
            },
            onMouseLeave: function onMouseLeave() {
              return _this.handleTooltipVisibleChange(index, false);
            }
          }))
        );
      }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
    }

    (0, _createClass3['default'])(ComponentWrapper, [{
      key: 'render',
      value: function render() {
        return _react2['default'].createElement(Component, (0, _extends4['default'])({}, this.props, { handle: this.handleWithTooltip }));
      }
    }]);
    return ComponentWrapper;
  }(_react2['default'].Component), _class.propTypes = {
    tipFormatter: _propTypes2['default'].func,
    handleStyle: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
    tipProps: _propTypes2['default'].object
  }, _class.defaultProps = {
    tipFormatter: function tipFormatter(value) {
      return value;
    },

    handleStyle: [{}],
    tipProps: {}
  }, _temp2;
}
module.exports = exports['default'];