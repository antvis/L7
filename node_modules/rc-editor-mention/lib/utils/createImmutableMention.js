'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports['default'] = createImmutableMention;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _Suggestions2 = require('../component/Suggestions.react');

var _Suggestions3 = _interopRequireDefault(_Suggestions2);

var _mentionStore = require('../model/mentionStore');

var _mentionStore2 = _interopRequireDefault(_mentionStore);

var _exportContent = require('../utils/exportContent');

var _exportContent2 = _interopRequireDefault(_exportContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

var MentionContentComponent = function MentionContentComponent(props) {
  var entityKey = props.entityKey,
      tag = props.tag,
      callbacks = props.callbacks;

  var contentState = callbacks.getEditorState().getCurrentContent();
  var data = contentState.getEntity(entityKey).getData();
  return _react2['default'].createElement(tag, (0, _extends3['default'])({}, props, { data: data }));
};

function mentionContentStrategy(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey && contentState.getEntity(entityKey).getType() === 'mention';
  }, callback);
}

function mentionTriggerStrategy(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey && contentState.getEntity(entityKey).getType() === 'trigger';
  }, callback);
}

function createImmutableMention() {
  var callbacks = {
    onChange: noop,
    onUpArrow: noop,
    onDownArrow: noop,
    getEditorState: noop,
    setEditorState: noop,
    handleReturn: noop,
    onBlur: noop
  };

  function _onChange(editorState) {
    var selectionState = editorState.getSelection();
    var currentContent = editorState.getCurrentContent();
    var anchorKey = selectionState.getAnchorKey();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);

    if (selectionState.isCollapsed()) {
      currentContent.createEntity('trigger', 'MUTABLE');

      var end = selectionState.getEndOffset();
      var start = end - 1;
      var selectedText = currentContentBlock.getText().slice(start, end);
      if (selectedText === '@') {
        var updatedContent = _draftJs.Modifier.replaceText(currentContent, selectionState.merge({
          anchorOffset: start,
          focusOffset: end
        }), '@', null, currentContent.getLastCreatedEntityKey());
        return _draftJs.EditorState.push(editorState, updatedContent, 'insert-mention');
      }
    }

    return editorState;
  }

  var componentProps = {
    callbacks: callbacks,
    mentionStore: _mentionStore2['default']
  };
  return {
    name: 'mention',
    Suggestions: function Suggestions(props) {
      return _react2['default'].createElement(_Suggestions3['default'], (0, _extends3['default'])({}, props, componentProps, {
        store: _mentionStore2['default']
      }));
    },
    decorators: [{
      strategy: mentionTriggerStrategy,
      component: function component(props) {
        return _react2['default'].createElement('span', (0, _extends3['default'])({}, props, { style: { color: 'red' } }));
      }
    }, {
      strategy: mentionContentStrategy,
      component: function component(props) {
        return _react2['default'].createElement(MentionContentComponent, (0, _extends3['default'])({}, props, { callbacks: callbacks }));
      }
    }],
    onChange: function onChange(editorState) {
      var updatedEditorState = _onChange(editorState);
      return callbacks.onChange ? callbacks.onChange(updatedEditorState) : updatedEditorState;
    },
    callbacks: callbacks,
    'export': _exportContent2['default']
  };
}
module.exports = exports['default'];