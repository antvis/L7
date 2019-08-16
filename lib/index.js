"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _scene = _interopRequireDefault(require("./core/scene"));

var _global = _interopRequireDefault(require("./global"));

var _source = _interopRequireDefault(require("./core/source"));

var _tile_source = _interopRequireDefault(require("./source/tile_source"));

var _source2 = require("./source");

var _interaction = require("./interaction");

var _layer = require("./layer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var version = _global["default"].version;
var exported = {
  version: version,
  Scene: _scene["default"],
  Source: _source["default"],
  TileSource: _tile_source["default"],
  registerParser: _source2.registerParser,
  registerTransform: _source2.registerTransform,
  registerLayer: _layer.registerLayer,
  registerInteraction: _interaction.registerInteraction,
  getInteraction: _interaction.getInteraction
};
var _default = exported;
exports["default"] = _default;