'use strict';

exports.__esModule = true;

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _DraftOffsetKey = require('draft-js/lib/DraftOffsetKey');

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _Nav = require('./Nav.react');

var _Nav2 = _interopRequireDefault(_Nav);

var _SuggestionWrapper = require('./SuggestionWrapper.react');

var _SuggestionWrapper2 = _interopRequireDefault(_SuggestionWrapper);

var _insertMention = require('../utils/insertMention');

var _insertMention2 = _interopRequireDefault(_insertMention);

var _clearMention = require('../utils/clearMention');

var _clearMention2 = _interopRequireDefault(_clearMention);

var _getOffset = require('../utils/getOffset');

var _getOffset2 = _interopRequireDefault(_getOffset);

var _getMentions = require('../utils/getMentions');

var _getMentions2 = _interopRequireDefault(_getMentions);

var _getSearchWord2 = require('../utils/getSearchWord');

var _getSearchWord3 = _interopRequireDefault(_getSearchWord2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var isNotFalse = function isNotFalse(i) {
  return i !== false;
};

var Suggestions = function (_React$Component) {
  (0, _inherits3['default'])(Suggestions, _React$Component);

  function Suggestions() {
    (0, _classCallCheck3['default'])(this, Suggestions);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this));

    _this.onEditorStateChange = function (editorState) {
      var offset = _this.props.store.getOffset();
      if (offset.size === 0) {
        _this.closeDropDown();
        return editorState;
      }
      var selection = editorState.getSelection();

      // 修复: 焦点移出再移入时, dropdown 会闪动一下
      // 原因: https://github.com/facebook/draft-js/blob/67c5e69499e3b0c149ce83b004872afdf4180463/src/component/handlers/edit/editOnFocus.js#L33
      // 此处强制 update 了一下,因此 onEditorStateChange 会 call 两次
      if (!_this.props.callbacks.getEditorState().getSelection().getHasFocus() && selection.getHasFocus()) {
        return editorState;
      }

      var _getSearchWord = (0, _getSearchWord3['default'])(editorState, selection),
          word = _getSearchWord.word;

      if (!word) {
        _this.closeDropDown();
        return editorState;
      }
      var selectionInsideMention = offset.map(function (_ref) {
        var offsetKey = _ref.offsetKey;

        var _decode = (0, _DraftOffsetKey.decode)(offsetKey),
            blockKey = _decode.blockKey,
            decoratorKey = _decode.decoratorKey,
            leafKey = _decode.leafKey;

        if (blockKey !== selection.anchorKey) {
          return false;
        }
        var leaf = editorState.getBlockTree(blockKey).getIn([decoratorKey, 'leaves', leafKey]);
        if (!leaf) {
          return false;
        }
        var startKey = leaf.get('start');
        var endKey = leaf.get('end');
        // 处理只有一个 `@` 符号时的情况
        if (!word) {
          return false;
        }
        if (startKey === endKey - 1) {
          return selection.anchorOffset >= startKey + 1 && selection.anchorOffset <= endKey ? offsetKey : false;
        }
        return selection.anchorOffset > startKey + 1 && selection.anchorOffset <= endKey ? offsetKey : false;
      });

      var selectionInText = selectionInsideMention.some(isNotFalse);
      _this.activeOffsetKey = selectionInsideMention.find(isNotFalse) || _this.activeOffsetKey;
      var trigger = _this.props.store.getTrigger(_this.activeOffsetKey);

      if (!selectionInText || !selection.getHasFocus()) {
        _this.closeDropDown();
        return editorState;
      }
      var searchValue = word.substring(trigger.length, word.length);
      if (_this.lastSearchValue !== searchValue || _this.lastTrigger !== trigger) {
        _this.lastSearchValue = searchValue;
        _this.lastTrigger = trigger;
        _this.props.onSearchChange(searchValue, trigger);
      }
      if (!_this.state.active) {
        // 特例处理 https://github.com/ant-design/ant-design/issues/7838
        // 暂时没有更优雅的方法
        if (!trigger || word.indexOf(trigger) !== -1) {
          _this.openDropDown();
        }
      }
      return editorState;
    };

    _this.onUpArrow = function (ev) {
      ev.preventDefault();
      if (_this.props.suggestions.length > 0) {
        var newIndex = _this.state.focusedIndex - 1;
        _this.setState({
          focusedIndex: Math.max(newIndex, 0)
        });
      }
    };

    _this.onBlur = function (ev) {
      ev.preventDefault();
      _this.closeDropDown();
    };

    _this.onDownArrow = function (ev) {
      ev.preventDefault();
      var newIndex = _this.state.focusedIndex + 1;
      _this.setState({
        focusedIndex: newIndex >= _this.props.suggestions.length ? 0 : newIndex
      });
    };

    _this.getContainer = function () {
      var popupContainer = document.createElement('div');
      var mountNode = void 0;
      if (_this.props.getSuggestionContainer) {
        mountNode = _this.props.getSuggestionContainer();
        popupContainer.style.position = 'relative';
      } else {
        mountNode = document.body;
      }
      mountNode.appendChild(popupContainer);
      return popupContainer;
    };

    _this.handleKeyBinding = function (command) {
      return command === 'split-block';
    };

    _this.handleReturn = function (ev) {
      ev.preventDefault();
      var selectedSuggestion = _this.props.suggestions[_this.state.focusedIndex];
      if (selectedSuggestion) {
        if (_react2['default'].isValidElement(selectedSuggestion)) {
          _this.onMentionSelect(selectedSuggestion.props.value, selectedSuggestion.props.data);
        } else {
          _this.onMentionSelect(selectedSuggestion);
        }
        _this.lastSearchValue = null;
        _this.lastTrigger = null;
        return true;
      }
      return false;
    };

    _this.renderReady = function () {
      var container = _this.dropdownContainer;
      if (!container) {
        return;
      }
      var active = _this.state.active;
      var activeOffsetKey = _this.activeOffsetKey;

      var offset = _this.props.store.getOffset();
      var dropDownPosition = offset.get(activeOffsetKey);

      if (active && dropDownPosition) {
        var placement = _this.props.placement;
        var dropDownStyle = _this.getPositionStyle(true, dropDownPosition.position());

        // Check if the above space is crowded
        var isTopCrowded = parseFloat(dropDownStyle.top) - window.scrollY - container.offsetHeight < 0;
        // Check if the under space is crowded
        var isBottomCrowded = (window.innerHeight || document.documentElement.clientHeight) - (parseFloat(dropDownStyle.top) - window.scrollY) - container.offsetHeight < 0;

        if (placement === 'top' && !isTopCrowded) {
          // The above space isn't crowded
          dropDownStyle.top = (parseFloat(dropDownStyle.top) - container.offsetHeight || 0) + 'px';
        }

        if (placement === 'bottom' && isBottomCrowded && !isTopCrowded) {
          // The above space isn't crowded and the under space is crowded.
          dropDownStyle.top = (parseFloat(dropDownStyle.top) - container.offsetHeight || 0) + 'px';
        }

        Object.keys(dropDownStyle).forEach(function (key) {
          container.style[key] = dropDownStyle[key];
        });
      }

      if (!_this.focusItem) {
        return;
      }
      (0, _domScrollIntoView2['default'])(_reactDom2['default'].findDOMNode(_this.focusItem), container, {
        onlyScrollIfNeeded: true
      });
    };

    _this.getNavigations = function () {
      var _this$props = _this.props,
          prefixCls = _this$props.prefixCls,
          suggestions = _this$props.suggestions;
      var focusedIndex = _this.state.focusedIndex;

      return suggestions.length ? _react2['default'].Children.map(suggestions, function (element, index) {
        var focusItem = index === focusedIndex;
        var ref = focusItem ? function (node) {
          _this.focusItem = node;
        } : null;
        var mentionClass = (0, _classnames2['default'])(prefixCls + '-dropdown-item', {
          focus: focusItem
        });
        if (_react2['default'].isValidElement(element)) {
          return _react2['default'].cloneElement(element, {
            className: mentionClass,
            onMouseDown: function onMouseDown() {
              return _this.onDropdownMentionSelect(element.props.value, element.props.data);
            },
            ref: ref
          });
        }
        return _react2['default'].createElement(
          _Nav2['default'],
          {
            ref: ref,
            className: mentionClass,
            onMouseDown: function onMouseDown() {
              return _this.onDropdownMentionSelect(element);
            }
          },
          element
        );
      }, _this) : _react2['default'].createElement(
        'div',
        { className: prefixCls + '-dropdown-notfound ' + prefixCls + '-dropdown-item' },
        _this.props.notFoundContent
      );
    };

    _this.state = {
      isActive: false,
      focusedIndex: 0,
      container: false
    };
    return _this;
  }

  Suggestions.prototype.componentDidMount = function componentDidMount() {
    this.props.callbacks.onChange = this.onEditorStateChange;
  };

  Suggestions.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions.length !== this.props.suggestions.length) {
      this.setState({
        focusedIndex: 0
      });
    }
  };

  Suggestions.prototype.onDropdownMentionSelect = function onDropdownMentionSelect(mention, data) {
    var _this2 = this;

    setTimeout(function () {
      _this2.onMentionSelect(mention, data);
    }, 100);
  };

  Suggestions.prototype.onMentionSelect = function onMentionSelect(mention, data) {
    var editorState = this.props.callbacks.getEditorState();
    var _props = this.props,
        store = _props.store,
        onSelect = _props.onSelect;

    var trigger = store.getTrigger(this.activeOffsetKey);
    if (onSelect) {
      onSelect(mention, data || mention);
    }
    if (this.props.noRedup) {
      var mentions = (0, _getMentions2['default'])(editorState.getCurrentContent(), trigger);
      if (mentions.indexOf('' + trigger + mention) !== -1) {
        // eslint-disable-next-line
        console.warn('you have specified `noRedup` props but have duplicated mentions.');
        this.closeDropDown();
        this.props.callbacks.setEditorState((0, _clearMention2['default'])(editorState));
        return;
      }
    }
    this.props.callbacks.setEditorState((0, _insertMention2['default'])(editorState, '' + trigger + mention, data, this.props.mode), true);
    this.closeDropDown();
  };

  Suggestions.prototype.getPositionStyle = function getPositionStyle(isActive, position) {
    if (this.props.getSuggestionStyle) {
      return this.props.getSuggestionStyle(isActive, position);
    }
    var container = this.props.getSuggestionContainer ? this.state.container : document.body;
    var offset = (0, _getOffset2['default'])(container);
    return position ? (0, _extends4['default'])({
      position: 'absolute',
      left: position.left - offset.left + 'px',
      top: position.top - offset.top + 'px'
    }, this.props.style) : {};
  };

  Suggestions.prototype.openDropDown = function openDropDown() {
    this.props.callbacks.onUpArrow = this.onUpArrow;
    this.props.callbacks.handleReturn = this.handleReturn;
    this.props.callbacks.handleKeyBinding = this.handleKeyBinding;
    this.props.callbacks.onDownArrow = this.onDownArrow;
    this.props.callbacks.onBlur = this.onBlur;
    this.setState({
      active: true,
      container: this.state.container || this.getContainer()
    });
  };

  Suggestions.prototype.closeDropDown = function closeDropDown() {
    this.props.callbacks.onUpArrow = null;
    this.props.callbacks.handleReturn = null;
    this.props.callbacks.handleKeyBinding = null;
    this.props.callbacks.onDownArrow = null;
    this.props.callbacks.onBlur = null;
    this.setState({
      active: false
    });
  };

  Suggestions.prototype.render = function render() {
    var _extends2,
        _this3 = this;

    var _props2 = this.props,
        prefixCls = _props2.prefixCls,
        className = _props2.className,
        placement = _props2.placement;
    var _state = this.state,
        container = _state.container,
        active = _state.active;

    var cls = (0, _classnames2['default'])((0, _extends4['default'])((_extends2 = {}, _extends2[prefixCls + '-dropdown'] = true, _extends2[prefixCls + '-dropdown-placement-' + placement] = true, _extends2), className));
    var transitionName = placement === 'top' ? 'slide-down' : 'slide-up';

    var navigations = this.getNavigations();

    return container ? _react2['default'].createElement(
      _SuggestionWrapper2['default'],
      { renderReady: this.renderReady, container: container },
      _react2['default'].createElement(
        _rcAnimate2['default'],
        { transitionName: transitionName },
        active ? _react2['default'].createElement(
          'div',
          { className: cls, ref: function ref(node) {
              _this3.dropdownContainer = node;
            } },
          navigations
        ) : null
      )
    ) : null;
  };

  return Suggestions;
}(_react2['default'].Component);

exports['default'] = Suggestions;


Suggestions.propTypes = {
  callbacks: _propTypes2['default'].object,
  suggestions: _propTypes2['default'].array,
  store: _propTypes2['default'].object,
  onSearchChange: _propTypes2['default'].func,
  prefixCls: _propTypes2['default'].string,
  mode: _propTypes2['default'].string,
  style: _propTypes2['default'].object,
  onSelect: _propTypes2['default'].func,
  getSuggestionContainer: _propTypes2['default'].func,
  notFoundContent: _propTypes2['default'].any,
  getSuggestionStyle: _propTypes2['default'].func,
  className: _propTypes2['default'].string,
  noRedup: _propTypes2['default'].bool,
  placement: _propTypes2['default'].string
};
module.exports = exports['default'];