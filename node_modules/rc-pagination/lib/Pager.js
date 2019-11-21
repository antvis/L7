'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Pager = function Pager(props) {
  var _classNames;

  var prefixCls = props.rootPrefixCls + '-item';
  var cls = (0, _classnames2['default'])(prefixCls, prefixCls + '-' + props.page, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-active', props.active), (0, _defineProperty3['default'])(_classNames, props.className, !!props.className), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', !props.page), _classNames));

  var handleClick = function handleClick() {
    props.onClick(props.page);
  };

  var handleKeyPress = function handleKeyPress(e) {
    props.onKeyPress(e, props.onClick, props.page);
  };

  return _react2['default'].createElement(
    'li',
    {
      title: props.showTitle ? props.page : null,
      className: cls,
      onClick: handleClick,
      onKeyPress: handleKeyPress,
      tabIndex: '0'
    },
    props.itemRender(props.page, 'page', _react2['default'].createElement(
      'a',
      null,
      props.page
    ))
  );
};

Pager.propTypes = {
  page: _propTypes2['default'].number,
  active: _propTypes2['default'].bool,
  last: _propTypes2['default'].bool,
  locale: _propTypes2['default'].object,
  className: _propTypes2['default'].string,
  showTitle: _propTypes2['default'].bool,
  rootPrefixCls: _propTypes2['default'].string,
  onClick: _propTypes2['default'].func,
  onKeyPress: _propTypes2['default'].func,
  itemRender: _propTypes2['default'].func
};

exports['default'] = Pager;
module.exports = exports['default'];