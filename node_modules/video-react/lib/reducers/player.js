"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = player;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _video = require("../actions/video");

var _player = require("../actions/player");

var initialState = {
  currentSrc: null,
  duration: 0,
  currentTime: 0,
  seekingTime: 0,
  buffered: null,
  waiting: false,
  seeking: false,
  paused: true,
  autoPaused: false,
  ended: false,
  playbackRate: 1,
  muted: false,
  volume: 1,
  readyState: 0,
  networkState: 0,
  videoWidth: 0,
  videoHeight: 0,
  hasStarted: false,
  userActivity: true,
  isActive: false,
  isFullscreen: false,
  activeTextTrack: null
};

function player() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _player.USER_ACTIVATE:
      return (0, _objectSpread2["default"])({}, state, {
        userActivity: action.activity
      });

    case _player.PLAYER_ACTIVATE:
      return (0, _objectSpread2["default"])({}, state, {
        isActive: action.activity
      });

    case _player.FULLSCREEN_CHANGE:
      return (0, _objectSpread2["default"])({}, state, {
        isFullscreen: !!action.isFullscreen
      });

    case _video.SEEKING_TIME:
      return (0, _objectSpread2["default"])({}, state, {
        seekingTime: action.time
      });

    case _video.END_SEEKING:
      return (0, _objectSpread2["default"])({}, state, {
        seekingTime: 0
      });

    case _video.LOAD_START:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        hasStarted: false,
        ended: false
      });

    case _video.CAN_PLAY:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        waiting: false
      });

    case _video.WAITING:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        waiting: true
      });

    case _video.CAN_PLAY_THROUGH:
    case _video.PLAYING:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        waiting: false
      });

    case _video.PLAY:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        ended: false,
        paused: false,
        autoPaused: false,
        waiting: false,
        hasStarted: true
      });

    case _video.PAUSE:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        paused: true
      });

    case _video.END:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        ended: true
      });

    case _video.SEEKING:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        seeking: true
      });

    case _video.SEEKED:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        seeking: false
      });

    case _video.ERROR:
      return (0, _objectSpread2["default"])({}, state, action.videoProps, {
        error: 'UNKNOWN ERROR',
        ended: true
      });

    case _video.DURATION_CHANGE:
    case _video.TIME_UPDATE:
    case _video.VOLUME_CHANGE:
    case _video.PROGRESS_CHANGE:
    case _video.RATE_CHANGE:
    case _video.SUSPEND:
    case _video.ABORT:
    case _video.EMPTIED:
    case _video.STALLED:
    case _video.LOADED_META_DATA:
    case _video.LOADED_DATA:
    case _video.RESIZE:
      return (0, _objectSpread2["default"])({}, state, action.videoProps);

    case _video.ACTIVATE_TEXT_TRACK:
      return (0, _objectSpread2["default"])({}, state, {
        activeTextTrack: action.textTrack
      });

    default:
      return state;
  }
}