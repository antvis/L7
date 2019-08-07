"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _composer = _interopRequireDefault(require("./composer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default(renderer, container) {
  var composer = new _composer["default"](renderer);

  var updateSize = function updateSize() {
    // TODO: Re-enable this when perf issues can be solved
    //
    // Rendering double the resolution of the screen can be really slow
    // var pixelRatio = window.devicePixelRatio;
    var pixelRatio = 1;
    composer.setSize(container.clientWidth * pixelRatio, container.clientHeight * pixelRatio);
  };

  window.addEventListener('resize', updateSize, false);
  updateSize();
  return composer;
}