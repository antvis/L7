"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDate = formatDate;

// eslint-disable-next-line import/prefer-default-export
function formatDate(value, format) {
  if (!value) {
    return '';
  }

  if (Array.isArray(format)) {
    format = format[0];
  }

  return value.format(format);
}
//# sourceMappingURL=utils.js.map
