"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(_ref) {
  var provider = _ref.provider,
      api = _ref.api;
  provider.handleAPI(api);

  if (provider.renderPreview) {
    // eslint-disable-next-line no-param-reassign
    api.renderPreview = provider.renderPreview;
  }

  return api;
};

exports["default"] = _default;