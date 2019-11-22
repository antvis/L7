'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var formShape = _propTypes2['default'].shape({
  getFieldsValue: _propTypes2['default'].func,
  getFieldValue: _propTypes2['default'].func,
  getFieldInstance: _propTypes2['default'].func,
  setFieldsValue: _propTypes2['default'].func,
  setFields: _propTypes2['default'].func,
  setFieldsInitialValue: _propTypes2['default'].func,
  getFieldDecorator: _propTypes2['default'].func,
  getFieldProps: _propTypes2['default'].func,
  getFieldsError: _propTypes2['default'].func,
  getFieldError: _propTypes2['default'].func,
  isFieldValidating: _propTypes2['default'].func,
  isFieldsValidating: _propTypes2['default'].func,
  isFieldsTouched: _propTypes2['default'].func,
  isFieldTouched: _propTypes2['default'].func,
  isSubmitting: _propTypes2['default'].func,
  submit: _propTypes2['default'].func,
  validateFields: _propTypes2['default'].func,
  resetFields: _propTypes2['default'].func
});

exports['default'] = formShape;
module.exports = exports['default'];