'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _rcEditorCore = require('rc-editor-core');

var _draftJs = require('draft-js');

var _createMention = require('../utils/createMention');

var _createMention2 = _interopRequireDefault(_createMention);

var _exportContent = require('../utils/exportContent');

var _exportContent2 = _interopRequireDefault(_exportContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Mention = function (_React$Component) {
  (0, _inherits3['default'])(Mention, _React$Component);

  function Mention(props) {
    (0, _classCallCheck3['default'])(this, Mention);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props));

    _this.onEditorChange = function (editorState) {
      var selection = editorState.getSelection();
      _this._decorator = editorState.getDecorator();
      var content = editorState.getCurrentContent();

      if (_this.props.onChange) {
        _this.setState({
          selection: selection
        }, function () {
          _this.props.onChange(content, (0, _exportContent2['default'])(content));
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

    _this.mention = (0, _createMention2['default'])({
      prefix: _this.getPrefix(props),
      tag: props.tag,
      mode: props.mode,
      mentionStyle: props.mentionStyle
    });

    _this.Suggestions = _this.mention.Suggestions;
    _this.plugins = [_this.mention];

    _this.state = {
      suggestions: props.suggestions,
      value: props.value && _draftJs.EditorState.createWithContent(props.value, new _draftJs.CompositeDecorator(_this.mention.decorators)),
      selection: _draftJs.SelectionState.createEmpty()
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
      value = _draftJs.EditorState.acceptSelection(_draftJs.EditorState.createWithContent(value, this._decorator), selection);
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

    var editorClass = (0, _classnames3['default'])(className, (_classnames = {}, _classnames[prefixCls + '-wrapper'] = true, _classnames.readonly = readOnly, _classnames.disabled = disabled, _classnames.multilines = multiLines, _classnames));
    var editorProps = this.controlledMode ? { value: this.state.value } : {};
    var defaultValueState = defaultValue && _draftJs.EditorState.createWithContent(typeof defaultValue === 'string' ? _draftJs.ContentState.createFromText(defaultValue) : defaultValue, this._decorator);
    return _react2['default'].createElement(
      'div',
      { className: editorClass, style: style, ref: function ref(wrapper) {
          return _this2._wrapper = wrapper;
        } },
      _react2['default'].createElement(
        _rcEditorCore.EditorCore,
        (0, _extends3['default'])({
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
        _react2['default'].createElement(Suggestions, {
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
}(_react2['default'].Component);

Mention.propTypes = {
  value: _propTypes2['default'].object,
  suggestions: _propTypes2['default'].array,
  prefix: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].arrayOf(_propTypes2['default'].string)]),
  prefixCls: _propTypes2['default'].string,
  tag: _propTypes2['default'].oneOfType([_propTypes2['default'].element, _propTypes2['default'].func]),
  style: _propTypes2['default'].object,
  className: _propTypes2['default'].string,
  onSearchChange: _propTypes2['default'].func,
  onChange: _propTypes2['default'].func,
  mode: _propTypes2['default'].string,
  multiLines: _propTypes2['default'].bool,
  suggestionStyle: _propTypes2['default'].object,
  placeholder: _propTypes2['default'].string,
  defaultValue: _propTypes2['default'].object,
  notFoundContent: _propTypes2['default'].any,
  position: _propTypes2['default'].string,
  onFocus: _propTypes2['default'].func,
  onBlur: _propTypes2['default'].func,
  onSelect: _propTypes2['default'].func,
  onKeyDown: _propTypes2['default'].func,
  getSuggestionContainer: _propTypes2['default'].func,
  noRedup: _propTypes2['default'].bool,
  mentionStyle: _propTypes2['default'].object,
  placement: _propTypes2['default'].string,
  editorKey: _propTypes2['default'].string
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

exports['default'] = Mention;
module.exports = exports['default'];