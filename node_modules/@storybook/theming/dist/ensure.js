"use strict";

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.freeze");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensure = void 0;

var _clientLogger = require("@storybook/client-logger");

var _deepObjectDiff = require("deep-object-diff");

var _commonTags = require("common-tags");

var _light = _interopRequireDefault(require("./themes/light"));

var _convert = require("./convert");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n          Your theme is missing properties, you should update your theme!\n\n          theme-data missing:\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ensure = function ensure(input) {
  if (!input) {
    return (0, _convert.convert)(_light["default"]);
  }

  var missing = (0, _deepObjectDiff.deletedDiff)(_light["default"], input);

  if (Object.keys(missing).length) {
    _clientLogger.logger.warn((0, _commonTags.stripIndent)(_templateObject()), missing);
  }

  return (0, _convert.convert)(input);
};

exports.ensure = ensure;