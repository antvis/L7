function getWord(text, position) {
  var str = String(text);
  /* eslint no-bitwise:0 */
  var pos = Number(position) >>> 0;

  // Search for the word's beginning and end.
  var left = str.slice(0, pos + 1).search(/\S+$/);
  var right = str.slice(pos).search(/\s/);

  if (right < 0) {
    return {
      word: str.slice(left),
      begin: left,
      end: str.length
    };
  }

  // Return the word, using the located bounds to extract it from the string.
  return {
    word: str.slice(left, right + pos),
    begin: left,
    end: right + pos
  };
}

export default function getSearchWord(editorState, selection) {
  var anchorKey = selection.getAnchorKey();
  var anchorOffset = selection.getAnchorOffset() - 1;
  var currentContent = editorState.getCurrentContent();
  var currentBlock = currentContent.getBlockForKey(anchorKey);
  if (currentBlock) {
    var blockText = currentBlock.getText();
    return getWord(blockText, anchorOffset);
  }
  return '';
}