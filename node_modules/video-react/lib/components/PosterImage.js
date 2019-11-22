"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var propTypes = {
  poster: _propTypes["default"].string,
  player: _propTypes["default"].object,
  actions: _propTypes["default"].object,
  className: _propTypes["default"].string
};

function PosterImage(_ref) {
  var poster = _ref.poster,
      player = _ref.player,
      actions = _ref.actions,
      className = _ref.className;

  if (!poster || player.hasStarted) {
    return null;
  }

  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-poster', className),
    style: {
      backgroundImage: "url(\"".concat(poster, "\")")
    },
    onClick: function onClick() {
      if (player.paused) {
        actions.play();
      }
    }
  });
}

PosterImage.propTypes = propTypes;
PosterImage.displayName = 'PosterImage';
var _default = PosterImage;
exports["default"] = _default;