import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import _Suggestions from '../component/Suggestions.react';
import SuggestionPortal from '../component/SuggestionPortal.react';
import MentionContent from '../component/MentionContent.react';
import mentionStore from '../model/mentionStore';
import exportContent from './exportContent';
import getRegExp from '../utils/getRegExp';

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
  return React.createElement(tag, _extends({}, props, { data: data }));
};

export default function createMention() {
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
    mentionStore: mentionStore
  };
  var suggestionRegex = getRegExp(config.prefix);

  var tag = config.tag || MentionContent;
  var decorators = [{
    strategy: function strategy(contentBlock, callback) {
      findWithRegex(suggestionRegex, contentBlock, callback);
    },
    component: function component(props) {
      return React.createElement(SuggestionPortal, _extends({}, props, componentProps, {
        style: config.mentionStyle,
        suggestionRegex: getRegExp(config.prefix)
      }));
    }
  }];
  if (config.mode === 'immutable') {
    decorators.unshift({
      strategy: mentionContentStrategy,
      component: function component(props) {
        return React.createElement(MentionContentComponent, _extends({ tag: tag }, props, { callbacks: callbacks }));
      }
    });
  }

  return {
    name: 'mention',
    Suggestions: function Suggestions(props) {
      return React.createElement(_Suggestions, _extends({}, props, componentProps, {
        store: mentionStore
      }));
    },
    decorators: decorators,
    onChange: function onChange(editorState) {
      return callbacks.onChange ? callbacks.onChange(editorState) : editorState;
    },
    callbacks: callbacks,
    'export': exportContent
  };
}