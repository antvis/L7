'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports['default'] = createMention;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Suggestions2 = require('../component/Suggestions.react');

var _Suggestions3 = _interopRequireDefault(_Suggestions2);

var _SuggestionPortal = require('../component/SuggestionPortal.react');

var _SuggestionPortal2 = _interopRequireDefault(_SuggestionPortal);

var _MentionContent = require('../component/MentionContent.react');

var _MentionContent2 = _interopRequireDefault(_MentionContent);

var _mentionStore = require('../model/mentionStore');

var _mentionStore2 = _interopRequireDefault(_mentionStore);

var _exportContent = require('./exportContent');

var _exportContent2 = _interopRequireDefault(_exportContent);

var _getRegExp = require('../utils/getRegExp');

var _getRegExp2 = _interopRequireDefault(_getRegExp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function findWithRegex(regex, contentBlock, callback) {
  // Get the text from the contentBlock
  var text = contentBlock.getText();
  var matchArr = void 0;
  var start = void 0; // eslint-disable-line
  var end = void 0;
  // Go through all matches in the text and return the indizes to the callback
  while ((matchArr = regex.exec(text)) !== null) {
    // eslint-disable-line
    start = matchArr.index;
    end = start + matchArr[0].length;
    callback(start, end);
    if (start === end) break;
  }
}

function mentionContentStrategy(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey && contentState.getEntity(entityKey).getType() === 'mention';
  }, callback);
}

function noop() {}

var MentionContentComponent = function MentionContentComponent(props) {
  var entityKey = props.entityKey,
      tag = props.tag,
      callbacks = props.callbacks;

  var contentState = callbacks.getEditorState().getCurrentContent();
  var data = contentState.getEntity(entityKey).getData();
  return _react2['default'].createElement(tag, (0, _extends3['default'])({}, props, { data: data }));
};

function createMention() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var callbacks = {
    onChange: noop,
    onUpArrow: noop,
    onDownArrow: noop,
    getEditorState: noop,
    setEditorState: noop,
    handleReturn: noop,
    onBlur: noop
  };
  var componentProps = {
    callbacks: callbacks,
    mentionStore: _mentionStore2['default']
  };
  var suggestionRegex = (0, _getRegExp2['default'])(config.prefix);

  var tag = config.tag || _MentionContent2['default'];
  var decorators = [{
    strategy: function strategy(contentBlock, callback) {
      findWithRegex(suggestionRegex, contentBlock, callback);
    },
    component: function component(props) {
      return _react2['default'].createElement(_SuggestionPortal2['default'], (0, _extends3['default'])({}, props, componentProps, {
        style: config.mentionStyle,
        suggestionRegex: (0, _getRegExp2['default'])(config.prefix)
      }));
    }
  }];
  if (config.mode === 'immutable') {
    decorators.unshift({
      strategy: mentionContentStrategy,
      component: function component(props) {
        return _react2['default'].createElement(MentionContentComponent, (0, _extends3['default'])({ tag: tag }, props, { callbacks: callbacks }));
      }
    });
  }

  return {
    name: 'mention',
    Suggestions: function Suggestions(props) {
      return _react2['default'].createElement(_Suggestions3['default'], (0, _extends3['default'])({}, props, componentProps, {
        store: _mentionStore2['default']
      }));
    },
    decorators: decorators,
    onChange: function onChange(editorState) {
      return callbacks.onChange ? callbacks.onChange(editorState) : editorState;
    },
    callbacks: callbacks,
    'export': _exportContent2['default']
  };
}
module.exports = exports['default'];