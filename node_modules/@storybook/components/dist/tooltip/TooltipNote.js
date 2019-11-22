"use strict";

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.freeze");

require("core-js/modules/es.string.bold");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TooltipNote = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  padding: 2px 6px;\n  line-height: 16px;\n  font-size: 10px;\n  font-weight: ", ";\n  color: ", ";\n  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);\n  border-radius: 4px;\n  white-space: nowrap;\n  pointer-events: none;\n  z-index: -1;\n  background: rgba(0, 0, 0, 0.4);\n  margin: 6px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Note = _theming.styled.div(_templateObject(), function (props) {
  return props.theme.typography.weight.bold;
}, function (props) {
  return props.theme.color.lightest;
});

var TooltipNote = function TooltipNote(_ref) {
  var note = _ref.note;
  return _react["default"].createElement(Note, null, note);
};

exports.TooltipNote = TooltipNote;
TooltipNote.displayName = "TooltipNote";