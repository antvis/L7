import { Modifier, EditorState } from 'draft-js';
import getSearchWord from './getSearchWord';

export default function clearMention(editorState) {
  var selection = editorState.getSelection();
  var searchWord = getSearchWord(editorState, selection);
  var begin = searchWord.begin,
      end = searchWord.end;

  var replacedContent = Modifier.replaceText(editorState.getCurrentContent(), selection.merge({
    anchorOffset: begin,
    focusOffset: end
  }), '', null);

  var InsertSpaceContent = Modifier.insertText(replacedContent, replacedContent.getSelectionAfter(), ' ');

  var newEditorState = EditorState.push(editorState, InsertSpaceContent, 'insert-mention');
  return EditorState.forceSelection(newEditorState, InsertSpaceContent.getSelectionAfter());
}