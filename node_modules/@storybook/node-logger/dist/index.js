"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "instance", {
  enumerable: true,
  get: function () {
    return _npmlog.default;
  }
});
exports.logger = exports.colors = void 0;

var _npmlog = _interopRequireDefault(require("npmlog"));

var _prettyHrtime = _interopRequireDefault(require("pretty-hrtime"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
const colors = {
  pink: _chalk.default.hex('F1618C'),
  purple: _chalk.default.hex('B57EE5'),
  orange: _chalk.default.hex('F3AD38'),
  green: _chalk.default.hex('A2E05E'),
  blue: _chalk.default.hex('6DABF5'),
  red: _chalk.default.hex('F16161'),
  gray: _chalk.default.gray
};
exports.colors = colors;
const logger = {
  info: message => _npmlog.default.info('', message),
  plain: message => console.log(message),
  line: (count = 1) => console.log(`${Array(count - 1).fill('\n')}`),
  warn: message => _npmlog.default.warn('', message),
  error: message => _npmlog.default.error('', message),
  trace: ({
    message,
    time
  }) => _npmlog.default.info('', `${message} (${colors.purple((0, _prettyHrtime.default)(time))})`),
  setLevel: (level = 'info') => {
    _npmlog.default.level = level;
  }
};
exports.logger = logger;