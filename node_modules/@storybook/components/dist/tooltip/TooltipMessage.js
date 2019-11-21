"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.freeze");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TooltipMessage = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _link = require("../typography/link/link");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  padding: 15px;\n  width: 280px;\n  box-sizing: border-box;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n  line-height: 18px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  margin-top: 8px;\n  text-align: center;\n\n  > * {\n    margin: 0 8px;\n    font-weight: ", ";\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  font-weight: ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Title = _theming.styled.div(_templateObject(), function (props) {
  return props.theme.typography.weight.black;
});

var Desc = _theming.styled.span(_templateObject2());

var Links = _theming.styled.div(_templateObject3(), function (props) {
  return props.theme.typography.weight.black;
});

var Message = _theming.styled.div(_templateObject4(), function (props) {
  return props.theme.color.darker;
});

var MessageWrapper = _theming.styled.div(_templateObject5());

var TooltipMessage = function TooltipMessage(_ref) {
  var title = _ref.title,
      desc = _ref.desc,
      links = _ref.links;
  return _react["default"].createElement(MessageWrapper, null, _react["default"].createElement(Message, null, title && _react["default"].createElement(Title, null, title), desc && _react["default"].createElement(Desc, null, desc)), links && _react["default"].createElement(Links, null, links.map(function (_ref2) {
    var linkTitle = _ref2.title,
        other = _objectWithoutProperties(_ref2, ["title"]);

    return _react["default"].createElement(_link.Link, _extends({}, other, {
      key: linkTitle
    }), linkTitle);
  })));
};

exports.TooltipMessage = TooltipMessage;
TooltipMessage.displayName = "TooltipMessage";
TooltipMessage.defaultProps = {
  title: null,
  desc: null,
  links: null
};