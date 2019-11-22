'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports['default'] = exportContent;

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function encodeContent(text) {
  return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join('<br > \n');
}

var MentionGenerator = function () {
  function MentionGenerator(contentState, options) {
    (0, _classCallCheck3['default'])(this, MentionGenerator);

    this.contentState = contentState;
    this.options = options;
  }

  MentionGenerator.prototype.generate = function generate() {
    var contentRaw = (0, _draftJs.convertToRaw)(this.contentState);
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

function exportContent(contentState) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return new MentionGenerator(contentState, options).generate();
}
module.exports = exports['default'];