'use strict';

exports.__esModule = true;
exports['default'] = handlePastedText;

var _draftJs = require('draft-js');

var _customHTML2Content = require('./customHTML2Content');

var _customHTML2Content2 = _interopRequireDefault(_customHTML2Content);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function handlePastedText(text, html) {
    if (html) {
        var fragment = (0, _customHTML2Content2['default'])(html);
        var withImage = _draftJs.Modifier.replaceWithFragment(imageBlock, insertionTarget, fragment);
    }
    return 'not-handled';
}
module.exports = exports['default'];