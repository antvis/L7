"use strict";

const validate = require('./validate');

const ValidationError = require('./ValidationError');

module.exports = validate.default;
module.exports.ValidationError = ValidationError.default; // Todo remove this in next major release

module.exports.ValidateError = ValidationError.default;