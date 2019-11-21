'use strict';

exports.__esModule = true;
exports.toEditorState = exports.GetHTML = exports.GetText = exports.EditorCore = undefined;

var _EditorCore = require('./EditorCore');

var _EditorCore2 = _interopRequireDefault(_EditorCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var GetText = _EditorCore2['default'].GetText,
    GetHTML = _EditorCore2['default'].GetHTML;

var toEditorState = _EditorCore2['default'].ToEditorState;
var EditorCorePublic = {
    EditorCore: _EditorCore2['default'],
    GetText: GetText,
    GetHTML: GetHTML,
    toEditorState: toEditorState
};
exports.EditorCore = _EditorCore2['default'];
exports.GetText = GetText;
exports.GetHTML = GetHTML;
exports.toEditorState = toEditorState;
exports['default'] = EditorCorePublic;