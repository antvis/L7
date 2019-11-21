import getRegExp from './getRegExp';

export default function getMentions(contentState) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '@';

  var regex = getRegExp(prefix);
  var entities = [];
  contentState.getBlockMap().forEach(function (block) {
    var blockText = block.getText();
    var matchArr = void 0;
    while ((matchArr = regex.exec(blockText)) !== null) {
      // eslint-disable-line
      entities.push(matchArr[0].trim());
    }
  });
  return entities;
}