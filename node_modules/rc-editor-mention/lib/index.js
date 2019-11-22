'use strict';

exports.__esModule = true;
exports.getMentions = exports.toEditorState = exports.toString = exports.Nav = undefined;

var _draftJs = require('draft-js');

var _Mention = require('./component/Mention.react');

var _Mention2 = _interopRequireDefault(_Mention);

var _exportContent = require('./utils/exportContent');

var _exportContent2 = _interopRequireDefault(_exportContent);

var _getMentions = require('./utils/getMentions');

var _getMentions2 = _interopRequireDefault(_getMentions);

var _Nav = require('./component/Nav.react');

var _Nav2 = _interopRequireDefault(_Nav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function toEditorState(text) {
  return _draftJs.ContentState.createFromText(text);
} // export this package's api


_Mention2['default'].Nav = _Nav2['default'];
_Mention2['default'].toString = _exportContent2['default'];
_Mention2['default'].toEditorState = toEditorState;
_Mention2['default'].getMentions = _getMentions2['default'];

exports.Nav = _Nav2['default'];
exports.toString = _exportContent2['default'];
exports.toEditorState = toEditorState;
exports.getMentions = _getMentions2['default'];
exports['default'] = _Mention2['default'];