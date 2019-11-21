"use strict";

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.freeze");

require("core-js/modules/es.string.bold");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Badge = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n      color: ", ";\n      background: ", ";\n    "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n      color: ", ";\n      background: ", ";\n    "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n      color: ", ";\n      background: ", ";\n    "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n      color: ", ";\n      background: ", ";\n    "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n      color: ", ";\n      background: ", ";\n    "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: inline-block;\n  font-size: 11px;\n  line-height: 12px;\n  align-self: center;\n  padding: 4px 12px;\n  border-radius: 3em;\n  font-weight: ", ";\n\n  svg {\n    height: 12px;\n    width: 12px;\n    margin-right: 4px;\n    margin-top: -2px;\n\n    path {\n      fill: currentColor;\n    }\n  }\n\n  ", ";\n\n  ", ";\n\n  ", ";\n\n  ", ";\n\n  ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var BadgeWrapper = _theming.styled.div(_templateObject(), function (props) {
  return props.theme.typography.weight.bold;
}, function (props) {
  return props.status === 'critical' && (0, _theming.css)(_templateObject2(), props.theme.color.critical, props.theme.background.critical);
}, function (props) {
  return props.status === 'negative' && (0, _theming.css)(_templateObject3(), props.theme.color.negative, props.theme.background.negative);
}, function (props) {
  return props.status === 'warning' && (0, _theming.css)(_templateObject4(), props.theme.color.warning, props.theme.background.warning);
}, function (props) {
  return props.status === 'neutral' && (0, _theming.css)(_templateObject5(), props.theme.color.dark, props.theme.color.mediumlight);
}, function (props) {
  return props.status === 'positive' && (0, _theming.css)(_templateObject6(), props.theme.color.positive, props.theme.background.positive);
});

var Badge = function Badge(_ref) {
  var props = Object.assign({}, _ref);
  return _react["default"].createElement(BadgeWrapper, props);
};

exports.Badge = Badge;
Badge.displayName = "Badge";