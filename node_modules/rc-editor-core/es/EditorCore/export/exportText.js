export function encodeContent(text) {
    return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join('<br />' + '\n');
}
export function decodeContent(text) {
    return text.split('<br />' + '\n').join('\n');
}
export default function exportText(editorState) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { encode: false };

    var content = editorState.getCurrentContent();
    var blockMap = content.getBlockMap();
    var encode = options.encode;

    return blockMap.map(function (block) {
        var resultText = '';
        var lastPosition = 0;
        var text = block.getText();
        block.findEntityRanges(function (character) {
            return !!character.getEntity();
        }, function (start, end) {
            var key = block.getEntityAt(start);
            var entityData = content.getEntity(key).getData();
            resultText += text.slice(lastPosition, start);
            resultText += entityData && entityData['export'] ? entityData['export'](entityData) : text.slice(start, end);
            lastPosition = end;
        });
        resultText += text.slice(lastPosition);
        return encode ? encodeContent(resultText) : resultText;
    }).join(encode ? '<br />\n' : '\n');
}