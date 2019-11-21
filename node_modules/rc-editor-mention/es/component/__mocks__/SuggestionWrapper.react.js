import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';

var SuggestionWrapper = function (_React$Component) {
  _inherits(SuggestionWrapper, _React$Component);

  function SuggestionWrapper() {
    _classCallCheck(this, SuggestionWrapper);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  SuggestionWrapper.prototype.componentDidMount = function componentDidMount() {
    this.props.renderReady();
  };

  SuggestionWrapper.prototype.componentDidUpdate = function componentDidUpdate() {
    this.props.renderReady();
  };

  SuggestionWrapper.prototype.render = function render() {
    return this.props.children;
  };

  return SuggestionWrapper;
}(React.Component);

export default SuggestionWrapper;