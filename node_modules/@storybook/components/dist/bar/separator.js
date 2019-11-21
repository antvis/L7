"use strict";

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interleaveSeparators = exports.Separator = void 0;

var _react = _interopRequireWildcard(require("react"));

var _theming = require("@storybook/theming");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var Separator = _theming.styled.span(function (_ref) {
  var theme = _ref.theme;
  return {
    width: 1,
    height: 24,
    background: theme.appBorderColor,
    marginTop: 8
  };
}, function (_ref2) {
  var force = _ref2.force;
  return force ? {} : {
    '& + &': {
      display: 'none'
    }
  };
});

exports.Separator = Separator;
Separator.displayName = 'Separator';

var interleaveSeparators = function interleaveSeparators(list) {
  return list.reduce(function (acc, item, index) {
    return item ? _react["default"].createElement(_react.Fragment, {
      key: item.id || item.key || "f-".concat(index)
    }, acc, index > 0 ? _react["default"].createElement(Separator, {
      key: "s-".concat(index)
    }) : null, item.render() || item) : acc;
  }, null);
};

exports.interleaveSeparators = interleaveSeparators;