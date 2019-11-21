'use strict';

exports.__esModule = true;
exports['default'] = insertMention;

var _draftJs = require('draft-js');

var _getSearchWord = require('./getSearchWord');

var _getSearchWord2 = _interopRequireDefault(_getSearchWord);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function insertMention(editorState, mention, data, mode) {
  var entityMode = mode === 'immutable' ? 'IMMUTABLE' : 'MUTABLE';
  var selection = editorState.getSelection();
  var contentState = editorState.getCurrentContent();

  contentState.createEntity('mention', entityMode, data || mention);
  var searchWord = (0, _getSearchWord2['default'])(editorState, selection);
  var begin = searchWord.begin,
      end = searchWord.end;

  var replacedContent = _draftJs.Modifier.replaceText(contentState, selection.merge({
    anchorOffset: begin,
    focusOffset: end
  }), mention, null, contentState.getLastCreatedEntityKey());

  var InsertSpaceContent = _draftJs.Modifier.insertText(replacedContent, replacedContent.getSelectionAfter(), ' ');

  var newEditorState = _draftJs.EditorState.push(editorState, InsertSpaceContent, 'insert-mention');
  return _draftJs.EditorState.forceSelection(newEditorState, InsertSpaceContent.getSelectionAfter());
}
module.exports = exports['default'];