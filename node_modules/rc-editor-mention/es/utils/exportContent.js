import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import { convertToRaw } from 'draft-js';

function encodeContent(text) {
  return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join('<br > \n');
}

var MentionGenerator = function () {
  function MentionGenerator(contentState, options) {
    _classCallCheck(this, MentionGenerator);

    this.contentState = contentState;
    this.options = options;
  }

  MentionGenerator.prototype.generate = function generate() {
    var contentRaw = convertToRaw(this.contentState);
    return this.processContent(contentRaw);
  };

  MentionGenerator.prototype.processContent = function processContent(contentRaw) {
    var blocks = contentRaw.blocks;
    var encode = this.options.encode;

    return blocks.map(function (block) {
      return encode ? encodeContent(block.text) : block.text;
    }).join(encode ? '<br />\n' : '\n');
  };

  return MentionGenerator;
}();

export default function exportContent(contentState) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return new MentionGenerator(contentState, options).generate();
}