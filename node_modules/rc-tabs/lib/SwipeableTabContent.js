'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _rcHammerjs = require('rc-hammerjs');

var _rcHammerjs2 = _interopRequireDefault(_rcHammerjs);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _TabContent = require('./TabContent');

var _TabContent2 = _interopRequireDefault(_TabContent);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RESISTANCE_COEF = 0.6;

function computeIndex(_ref) {
  var maxIndex = _ref.maxIndex,
      startIndex = _ref.startIndex,
      delta = _ref.delta,
      viewSize = _ref.viewSize;

  var index = startIndex + -delta / viewSize;
  if (index < 0) {
    index = Math.exp(index * RESISTANCE_COEF) - 1;
  } else if (index > maxIndex) {
    index = maxIndex + 1 - Math.exp((maxIndex - index) * RESISTANCE_COEF);
  }
  return index;
}

function getIndexByDelta(e) {
  var delta = (0, _utils.isVertical)(this.props.tabBarPosition) ? e.deltaY : e.deltaX;
  var otherDelta = (0, _utils.isVertical)(this.props.tabBarPosition) ? e.deltaX : e.deltaY;
  if (Math.abs(delta) < Math.abs(otherDelta)) {
    return undefined;
  }
  var currentIndex = computeIndex({
    maxIndex: this.maxIndex,
    viewSize: this.viewSize,
    startIndex: this.startIndex,
    delta: delta
  });
  var showIndex = delta < 0 ? Math.floor(currentIndex + 1) : Math.floor(currentIndex);
  if (showIndex < 0) {
    showIndex = 0;
  } else if (showIndex > this.maxIndex) {
    showIndex = this.maxIndex;
  }
  if (this.children[showIndex].props.disabled) {
    return undefined;
  }
  return currentIndex;
}

var SwipeableTabContent = function (_React$Component) {
  (0, _inherits3['default'])(SwipeableTabContent, _React$Component);

  function SwipeableTabContent() {
    var _ref2;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, SwipeableTabContent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref2 = SwipeableTabContent.__proto__ || Object.getPrototypeOf(SwipeableTabContent)).call.apply(_ref2, [this].concat(args))), _this), _this.onPanStart = function () {
      var _this$props = _this.props,
          tabBarPosition = _this$props.tabBarPosition,
          children = _this$props.children,
          activeKey = _this$props.activeKey,
          animated = _this$props.animated;

      _this.startIndex = (0, _utils.getActiveIndex)(children, activeKey);
      var startIndex = _this.startIndex;
      if (startIndex === -1) {
        return;
      }
      if (animated) {
        (0, _utils.setTransition)(_this.rootNode.style, 'none');
      }
      _this.startDrag = true;
      _this.children = (0, _utils.toArray)(children);
      _this.maxIndex = _this.children.length - 1;
      _this.viewSize = (0, _utils.isVertical)(tabBarPosition) ? _this.rootNode.offsetHeight : _this.rootNode.offsetWidth;
    }, _this.onPan = function (e) {
      if (!_this.startDrag) {
        return;
      }
      var tabBarPosition = _this.props.tabBarPosition;

      var currentIndex = getIndexByDelta.call(_this, e);
      if (currentIndex !== undefined) {
        (0, _utils.setTransform)(_this.rootNode.style, (0, _utils.getTransformByIndex)(currentIndex, tabBarPosition));
      }
    }, _this.onPanEnd = function (e) {
      if (!_this.startDrag) {
        return;
      }
      _this.end(e);
    }, _this.onSwipe = function (e) {
      _this.end(e, true);
    }, _this.end = function (e, swipe) {
      var _this$props2 = _this.props,
          tabBarPosition = _this$props2.tabBarPosition,
          animated = _this$props2.animated;

      _this.startDrag = false;
      if (animated) {
        (0, _utils.setTransition)(_this.rootNode.style, '');
      }
      var currentIndex = getIndexByDelta.call(_this, e);
      var finalIndex = _this.startIndex;
      if (currentIndex !== undefined) {
        if (currentIndex < 0) {
          finalIndex = 0;
        } else if (currentIndex > _this.maxIndex) {
          finalIndex = _this.maxIndex;
        } else if (swipe) {
          var delta = (0, _utils.isVertical)(tabBarPosition) ? e.deltaY : e.deltaX;
          finalIndex = delta < 0 ? Math.ceil(currentIndex) : Math.floor(currentIndex);
        } else {
          var floorIndex = Math.floor(currentIndex);
          if (currentIndex - floorIndex > 0.6) {
            finalIndex = floorIndex + 1;
          } else {
            finalIndex = floorIndex;
          }
        }
      }
      if (_this.children[finalIndex].props.disabled) {
        return;
      }
      if (_this.startIndex === finalIndex) {
        if (animated) {
          (0, _utils.setTransform)(_this.rootNode.style, (0, _utils.getTransformByIndex)(finalIndex, _this.props.tabBarPosition));
        }
      } else {
        _this.props.onChange((0, _utils.getActiveKey)(_this.props.children, finalIndex));
      }
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(SwipeableTabContent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.rootNode = _reactDom2['default'].findDOMNode(this);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          tabBarPosition = _props.tabBarPosition,
          hammerOptions = _props.hammerOptions,
          animated = _props.animated;

      var events = {
        onSwipe: this.onSwipe,
        onPanStart: this.onPanStart
      };
      if (animated !== false) {
        events = (0, _extends3['default'])({}, events, {
          onPan: this.onPan,
          onPanEnd: this.onPanEnd
        });
      }
      return _react2['default'].createElement(
        _rcHammerjs2['default'],
        (0, _extends3['default'])({}, events, {
          direction: (0, _utils.isVertical)(tabBarPosition) ? 'DIRECTION_ALL' : 'DIRECTION_HORIZONTAL',
          options: hammerOptions
        }),
        _react2['default'].createElement(_TabContent2['default'], this.props)
      );
    }
  }]);
  return SwipeableTabContent;
}(_react2['default'].Component);

exports['default'] = SwipeableTabContent;


SwipeableTabContent.propTypes = {
  tabBarPosition: _propTypes2['default'].string,
  onChange: _propTypes2['default'].func,
  children: _propTypes2['default'].node,
  hammerOptions: _propTypes2['default'].any,
  animated: _propTypes2['default'].bool,
  activeKey: _propTypes2['default'].string
};

SwipeableTabContent.defaultProps = {
  animated: true
};
module.exports = exports['default'];