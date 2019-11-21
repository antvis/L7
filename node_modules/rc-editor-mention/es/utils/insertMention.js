import { Modifier, EditorState } from 'draft-js';
import getSearchWord from './getSearchWord';

export default function insertMention(editorState, mention, data, mode) {
  var entityMode = mode === 'immutable' ? 'IMMUTABLE' : 'MUTABLE';
  var selection = editorState.getSelection();
  var contentState = editorState.getCurrentContent();

  contentState.createEntity('mention', entityMode, data || mention);
  var searchWord = getSearchWord(editorState, selection);
  var begin = searchWord.begin,
      end = searchWord.end;

  var replacedContent = Modifier.replaceText(contentState, selection.merge({
    anchorOffset: begin,
    focusOffset: end
  }), mention, null, contentState.getLastCreatedEntityKey());

  var InsertSpaceContent = Modifier.insertText(replacedContent, replacedContent.getSelectionAfter(), ' ');

  var newEditorState = EditorState.push(editorState, InsertSpaceContent, 'insert-mention');
  return EditorState.forceSelection(newEditorState, InsertSpaceContent.getSelectionAfter());
}