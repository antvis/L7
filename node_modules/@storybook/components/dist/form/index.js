"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _theming = require("@storybook/theming");

var _field = require("./field/field");

var _input = require("./input/input");

// InputStyleProps import is for TS
var Form = Object.assign(_theming.styled.form({
  boxSizing: 'border-box',
  width: '100%'
}), {
  Field: _field.Field,
  Input: _input.Input,
  Select: _input.Select,
  Textarea: _input.Textarea,
  Button: _input.Button
});
exports.Form = Form;