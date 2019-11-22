import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import { EditorState, Modifier } from 'draft-js';
import _Suggestions from '../component/Suggestions.react';
import mentionStore from '../model/mentionStore';
import exportContent from '../utils/exportContent';

function noop() {}

var MentionContentComponent = function MentionContentComponent(props) {
  var entityKey = props.entityKey,
      tag = props.tag,
      callbacks = props.callbacks;

  var contentState = callbacks.getEditorState().getCurrentContent();
  var data = contentState.getEntity(entityKey).getData();
  return React.createElement(tag, _extends({}, props, { data: data }));
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

export default function createImmutableMention() {
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
        var updatedContent = Modifier.replaceText(currentContent, selectionState.merge({
          anchorOffset: start,
          focusOffset: end
        }), '@', null, currentContent.getLastCreatedEntityKey());
        return EditorState.push(editorState, updatedContent, 'insert-mention');
      }
    }

    return editorState;
  }

  var componentProps = {
    callbacks: callbacks,
    mentionStore: mentionStore
  };
  return {
    name: 'mention',
    Suggestions: function Suggestions(props) {
      return React.createElement(_Suggestions, _extends({}, props, componentProps, {
        store: mentionStore
      }));
    },
    decorators: [{
      strategy: mentionTriggerStrategy,
      component: function component(props) {
        return React.createElement('span', _extends({}, props, { style: { color: 'red' } }));
      }
    }, {
      strategy: mentionContentStrategy,
      component: function component(props) {
        return React.createElement(MentionContentComponent, _extends({}, props, { callbacks: callbacks }));
      }
    }],
    onChange: function onChange(editorState) {
      var updatedEditorState = _onChange(editorState);
      return callbacks.onChange ? callbacks.onChange(updatedEditorState) : updatedEditorState;
    },
    callbacks: callbacks,
    'export': exportContent
  };
}