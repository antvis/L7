'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _eventlistener = require('eventlistener');

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.throttle');

var _lodash4 = _interopRequireDefault(_lodash3);

var _parentScroll = require('./utils/parentScroll');

var _parentScroll2 = _interopRequireDefault(_parentScroll);

var _inViewport = require('./utils/inViewport');

var _inViewport2 = _interopRequireDefault(_inViewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LazyLoad = function (_Component) {
  _inherits(LazyLoad, _Component);

  function LazyLoad(props) {
    _classCallCheck(this, LazyLoad);

    var _this = _possibleConstructorReturn(this, (LazyLoad.__proto__ || Object.getPrototypeOf(LazyLoad)).call(this, props));

    _this.lazyLoadHandler = _this.lazyLoadHandler.bind(_this);

    if (props.throttle > 0) {
      if (props.debounce) {
        _this.lazyLoadHandler = (0, _lodash2.default)(_this.lazyLoadHandler, props.throttle);
      } else {
        _this.lazyLoadHandler = (0, _lodash4.default)(_this.lazyLoadHandler, props.throttle);
      }
    }

    _this.state = { visible: false };
    return _this;
  }

  _createClass(LazyLoad, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._mounted = true;
      var eventNode = this.getEventNode();

      this.lazyLoadHandler();

      if (this.lazyLoadHandler.flush) {
        this.lazyLoadHandler.flush();
      }

      (0, _eventlistener.add)(window, 'resize', this.lazyLoadHandler);
      (0, _eventlistener.add)(eventNode, 'scroll', this.lazyLoadHandler);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      if (!this.state.visible) {
        this.lazyLoadHandler();
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(_nextProps, nextState) {
      return nextState.visible;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._mounted = false;
      if (this.lazyLoadHandler.cancel) {
        this.lazyLoadHandler.cancel();
      }

      this.detachListeners();
    }
  }, {
    key: 'getEventNode',
    value: function getEventNode() {
      return (0, _parentScroll2.default)((0, _reactDom.findDOMNode)(this));
    }
  }, {
    key: 'getOffset',
    value: function getOffset() {
      var _props = this.props,
          offset = _props.offset,
          offsetVertical = _props.offsetVertical,
          offsetHorizontal = _props.offsetHorizontal,
          offsetTop = _props.offsetTop,
          offsetBottom = _props.offsetBottom,
          offsetLeft = _props.offsetLeft,
          offsetRight = _props.offsetRight,
          threshold = _props.threshold;


      var _offsetAll = threshold || offset;
      var _offsetVertical = offsetVertical || _offsetAll;
      var _offsetHorizontal = offsetHorizontal || _offsetAll;

      return {
        top: offsetTop || _offsetVertical,
        bottom: offsetBottom || _offsetVertical,
        left: offsetLeft || _offsetHorizontal,
        right: offsetRight || _offsetHorizontal
      };
    }
  }, {
    key: 'lazyLoadHandler',
    value: function lazyLoadHandler() {
      if (!this._mounted) {
        return;
      }
      var offset = this.getOffset();
      var node = (0, _reactDom.findDOMNode)(this);
      var eventNode = this.getEventNode();

      if ((0, _inViewport2.default)(node, eventNode, offset)) {
        var onContentVisible = this.props.onContentVisible;


        this.setState({ visible: true }, function () {
          if (onContentVisible) {
            onContentVisible();
          }
        });
        this.detachListeners();
      }
    }
  }, {
    key: 'detachListeners',
    value: function detachListeners() {
      var eventNode = this.getEventNode();

      (0, _eventlistener.remove)(window, 'resize', this.lazyLoadHandler);
      (0, _eventlistener.remove)(eventNode, 'scroll', this.lazyLoadHandler);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          height = _props2.height,
          width = _props2.width;
      var visible = this.state.visible;


      var elStyles = { height: height, width: width };
      var elClasses = 'LazyLoad' + (visible ? ' is-visible' : '') + (className ? ' ' + className : '');

      return _react2.default.createElement(this.props.elementType, {
        className: elClasses,
        style: elStyles
      }, visible && _react.Children.only(children));
    }
  }]);

  return LazyLoad;
}(_react.Component);

exports.default = LazyLoad;


LazyLoad.propTypes = {
  children: _propTypes2.default.node.isRequired,
  className: _propTypes2.default.string,
  debounce: _propTypes2.default.bool,
  elementType: _propTypes2.default.string,
  height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  offset: _propTypes2.default.number,
  offsetBottom: _propTypes2.default.number,
  offsetHorizontal: _propTypes2.default.number,
  offsetLeft: _propTypes2.default.number,
  offsetRight: _propTypes2.default.number,
  offsetTop: _propTypes2.default.number,
  offsetVertical: _propTypes2.default.number,
  threshold: _propTypes2.default.number,
  throttle: _propTypes2.default.number,
  width: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  onContentVisible: _propTypes2.default.func
};

LazyLoad.defaultProps = {
  elementType: 'div',
  debounce: true,
  offset: 0,
  offsetBottom: 0,
  offsetHorizontal: 0,
  offsetLeft: 0,
  offsetRight: 0,
  offsetTop: 0,
  offsetVertical: 0,
  throttle: 250
};