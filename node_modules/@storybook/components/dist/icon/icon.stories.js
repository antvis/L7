"use strict";

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.sort");

require("core-js/modules/es.object.keys");

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _react2 = require("@storybook/react");

var _icon = require("./icon");

var _icons = require("./icons");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Meta = _theming.styled.div({
  color: '#333',
  fontSize: 12
});

var Item = _theming.styled.div({
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  flex: '0 1 20%',
  minWidth: 120,
  padding: '0px 7.5px 20px',
  '& svg': {
    marginRight: 10,
    width: 24,
    height: 24
  }
}, function (_ref) {
  var minimal = _ref.minimal;
  return minimal ? {
    flex: 'none',
    minWidth: 'auto',
    padding: 0,
    background: '#fff',
    border: '1px solid #666',
    '& svg': {
      display: 'block',
      marginRight: 0,
      width: 48,
      height: 48
    }
  } : {};
});

var List = _theming.styled.div({
  display: 'flex',
  flexFlow: 'row wrap'
});

var list = Object.keys(_icons.icons).sort();
(0, _react2.storiesOf)('Basics|Icon', module).add('labels', function () {
  return _react["default"].createElement(List, null, list.map(function (key) {
    return _react["default"].createElement(Item, {
      key: key
    }, _react["default"].createElement(_icon.Icons, {
      icon: key
    }), " ", _react["default"].createElement(Meta, null, key));
  }));
}).add('no labels', function () {
  return _react["default"].createElement(List, null, list.map(function (key) {
    return _react["default"].createElement(Item, {
      minimal: true,
      key: key
    }, _react["default"].createElement(_icon.Icons, {
      icon: key
    }));
  }));
});