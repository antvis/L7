import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import { createPortal, unstable_renderSubtreeIntoContainer } from 'react-dom';

var IS_REACT_16 = !!createPortal;

var SuggestionWrapper = function (_React$Component) {
  _inherits(SuggestionWrapper, _React$Component);

  function SuggestionWrapper() {
    _classCallCheck(this, SuggestionWrapper);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  SuggestionWrapper.prototype.componentDidMount = function componentDidMount() {
    this.renderOrReady();
  };

  SuggestionWrapper.prototype.componentDidUpdate = function componentDidUpdate() {
    this.renderOrReady();
  };

  SuggestionWrapper.prototype.renderOrReady = function renderOrReady() {
    if (IS_REACT_16) {
      this.props.renderReady();
    } else {
      this.renderComponent();
    }
  };

  SuggestionWrapper.prototype.renderComponent = function renderComponent() {
    var _props = this.props,
        children = _props.children,
        container = _props.container,
        renderReady = _props.renderReady;

    unstable_renderSubtreeIntoContainer(this, children, container, function callback() {
      if (renderReady) {
        renderReady.call(this);
      }
    });
  };

  SuggestionWrapper.prototype.render = function render() {
    if (IS_REACT_16) {
      var _props2 = this.props,
          children = _props2.children,
          container = _props2.container;

      return createPortal(children, container);
    }
    return null;
  };

  return SuggestionWrapper;
}(React.Component);

export default SuggestionWrapper;


SuggestionWrapper.propTypes = {
  children: PropTypes.any,
  renderReady: PropTypes.func,
  container: PropTypes.any
};