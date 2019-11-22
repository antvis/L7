import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import getOffset from '../utils/getOffset';

var SuggestionPortal = function (_React$Component) {
  _inherits(SuggestionPortal, _React$Component);

  function SuggestionPortal() {
    var _temp, _this, _ret;

    _classCallCheck(this, SuggestionPortal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.matchDecorates = function (props) {
      var callbacks = props.callbacks,
          suggestionRegex = props.suggestionRegex,
          decoratedText = props.decoratedText;

      var matches = suggestionRegex.exec(decoratedText);
      _this.trigger = matches[2];
      _this.updatePortalPosition(_this.props);
      callbacks.setEditorState(callbacks.getEditorState());
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  SuggestionPortal.prototype.componentWillMount = function componentWillMount() {
    this.matchDecorates(this.props);
  };

  SuggestionPortal.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.decoratedText !== this.props.decoratedText) {
      this.matchDecorates(nextProps);
    }
    this.updatePortalPosition(nextProps);
  };

  SuggestionPortal.prototype.componentWillUnmount = function componentWillUnmount() {
    var _props = this.props,
        offsetKey = _props.offsetKey,
        mentionStore = _props.mentionStore;

    mentionStore.inActiveSuggestion({ offsetKey: offsetKey });
  };

  SuggestionPortal.prototype.updatePortalPosition = function updatePortalPosition(props) {
    var _this2 = this;

    var offsetKey = props.offsetKey,
        mentionStore = props.mentionStore;

    mentionStore.updateSuggestion({
      offsetKey: offsetKey,
      trigger: this.trigger,
      position: function position() {
        var element = _this2.searchPortal;
        var rect = getOffset(element);
        return {
          left: rect.left,
          top: rect.top,
          width: element.offsetWidth,
          height: element.offsetHeight
        };
      }
    });
  };

  SuggestionPortal.prototype.render = function render() {
    var _this3 = this;

    return React.createElement(
      'span',
      { ref: function ref(node) {
          _this3.searchPortal = node;
        }, style: this.props.style },
      this.props.children
    );
  };

  return SuggestionPortal;
}(React.Component);

SuggestionPortal.propTypes = {
  offsetKey: PropTypes.any,
  mentionStore: PropTypes.object,
  decoratedText: PropTypes.string,
  children: PropTypes.any,
  callbacks: PropTypes.any,
  suggestionRegex: PropTypes.any
};
export default SuggestionPortal;