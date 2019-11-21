import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { EditorCore } from 'rc-editor-core';
import { EditorState, SelectionState, ContentState, CompositeDecorator } from 'draft-js';

import createMention from '../utils/createMention';
import exportContent from '../utils/exportContent';

var Mention = function (_React$Component) {
  _inherits(Mention, _React$Component);

  function Mention(props) {
    _classCallCheck(this, Mention);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onEditorChange = function (editorState) {
      var selection = editorState.getSelection();
      _this._decorator = editorState.getDecorator();
      var content = editorState.getCurrentContent();

      if (_this.props.onChange) {
        _this.setState({
          selection: selection
        }, function () {
          _this.props.onChange(content, exportContent(content));
        });
      } else {
        _this.setState({
          editorState: editorState,
          selection: selection
        });
      }
    };

    _this.onFocus = function (e) {
      if (_this.props.onFocus) {
        _this.props.onFocus(e);
      }
    };

    _this.onBlur = function (e) {
      if (_this.props.onBlur) {
        _this.props.onBlur(e);
      }
    };

    _this.onKeyDown = function (e) {
      if (_this.props.onKeyDown) {
        _this.props.onKeyDown(e);
      }
    };

    _this.reset = function () {
      /*eslint-disable*/
      _this._editor.Reset();
      /*eslint-enable*/
    };

    _this.mention = createMention({
      prefix: _this.getPrefix(props),
      tag: props.tag,
      mode: props.mode,
      mentionStyle: props.mentionStyle
    });

    _this.Suggestions = _this.mention.Suggestions;
    _this.plugins = [_this.mention];

    _this.state = {
      suggestions: props.suggestions,
      value: props.value && EditorState.createWithContent(props.value, new CompositeDecorator(_this.mention.decorators)),
      selection: SelectionState.createEmpty()
    };

    if (typeof props.defaultValue === 'string') {
      // eslint-disable-next-line
      console.warn('The property `defaultValue` now allow `EditorState` only, see http://react-component.github.io/editor-mention/examples/defaultValue.html ');
    }
    if (props.value !== undefined) {
      _this.controlledMode = true;
    }
    return _this;
  }

  Mention.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var suggestions = nextProps.suggestions;
    var selection = this.state.selection;

    var value = nextProps.value;
    if (value && selection) {
      value = EditorState.acceptSelection(EditorState.createWithContent(value, this._decorator), selection);
    }
    this.setState({
      suggestions: suggestions,
      value: value
    });
  };

  Mention.prototype.getPrefix = function getPrefix() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

    return Array.isArray(props.prefix) ? props.prefix : [props.prefix];
  };

  Mention.prototype.render = function render() {
    var _classnames,
        _this2 = this;

    var _props = this.props,
        prefixCls = _props.prefixCls,
        style = _props.style,
        tag = _props.tag,
        multiLines = _props.multiLines,
        editorKey = _props.editorKey,
        suggestionStyle = _props.suggestionStyle,
        placeholder = _props.placeholder,
        defaultValue = _props.defaultValue,
        className = _props.className,
        notFoundContent = _props.notFoundContent,
        getSuggestionContainer = _props.getSuggestionContainer,
        readOnly = _props.readOnly,
        disabled = _props.disabled,
        placement = _props.placement,
        mode = _props.mode;
    var suggestions = this.state.suggestions;
    var Suggestions = this.Suggestions;

    var editorClass = classnames(className, (_classnames = {}, _classnames[prefixCls + '-wrapper'] = true, _classnames.readonly = readOnly, _classnames.disabled = disabled, _classnames.multilines = multiLines, _classnames));
    var editorProps = this.controlledMode ? { value: this.state.value } : {};
    var defaultValueState = defaultValue && EditorState.createWithContent(typeof defaultValue === 'string' ? ContentState.createFromText(defaultValue) : defaultValue, this._decorator);
    return React.createElement(
      'div',
      { className: editorClass, style: style, ref: function ref(wrapper) {
          return _this2._wrapper = wrapper;
        } },
      React.createElement(
        EditorCore,
        _extends({
          ref: function ref(editor) {
            return _this2._editor = editor;
          },
          prefixCls: prefixCls,
          style: style,
          multiLines: multiLines,
          editorKey: editorKey,
          plugins: this.plugins,
          defaultValue: defaultValueState,
          placeholder: placeholder,
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          onKeyDown: this.onKeyDown,
          onChange: this.onEditorChange
        }, editorProps, {
          readOnly: readOnly || disabled
        }),
        React.createElement(Suggestions, {
          mode: tag ? 'immutable' : mode,
          prefix: this.getPrefix(),
          prefixCls: prefixCls,
          style: suggestionStyle,
          placement: placement,
          notFoundContent: notFoundContent,
          suggestions: suggestions,
          getSuggestionContainer: getSuggestionContainer ? function () {
            return getSuggestionContainer(_this2._wrapper);
          } : null,
          onSearchChange: this.props.onSearchChange,
          onSelect: this.props.onSelect,
          noRedup: this.props.noRedup
        })
      )
    );
  };

  return Mention;
}(React.Component);

Mention.propTypes = {
  value: PropTypes.object,
  suggestions: PropTypes.array,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  prefixCls: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  style: PropTypes.object,
  className: PropTypes.string,
  onSearchChange: PropTypes.func,
  onChange: PropTypes.func,
  mode: PropTypes.string,
  multiLines: PropTypes.bool,
  suggestionStyle: PropTypes.object,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.object,
  notFoundContent: PropTypes.any,
  position: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onSelect: PropTypes.func,
  onKeyDown: PropTypes.func,
  getSuggestionContainer: PropTypes.func,
  noRedup: PropTypes.bool,
  mentionStyle: PropTypes.object,
  placement: PropTypes.string,
  editorKey: PropTypes.string
};
Mention.controlledMode = false;


Mention.defaultProps = {
  prefixCls: 'rc-editor-mention',
  prefix: '@',
  mode: 'mutable',
  suggestions: [],
  multiLines: false,
  className: '',
  suggestionStyle: {},
  notFoundContent: '无法找到',
  position: 'absolute',
  placement: 'bottom', // top, bottom
  mentionStyle: {}
};

export default Mention;