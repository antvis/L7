'use strict';

exports.__esModule = true;
exports['default'] = clearMention;

var _draftJs = require('draft-js');

var _getSearchWord = require('./getSearchWord');

var _getSearchWord2 = _interopRequireDefault(_getSearchWord);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function clearMention(editorState) {
  var selection = editorState.getSelection();
  var searchWord = (0, _getSearchWord2['default'])(editorState, selection);
  var begin = searchWord.begin,
      end = searchWord.end;

  var replacedContent = _draftJs.Modifier.replaceText(editorState.getCurrentContent(), selection.merge({
    anchorOffset: begin,
    focusOffset: end
  }), '', null);

  var InsertSpaceContent = _draftJs.Modifier.insertText(replacedContent, replacedContent.getSelectionAfter(), ' ');

  var newEditorState = _draftJs.EditorState.push(editorState, InsertSpaceContent, 'insert-mention');
  return _draftJs.EditorState.forceSelection(newEditorState, InsertSpaceContent.getSelectionAfter());
}
module.exports = exports['default'];