import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import Hammer from 'rc-hammerjs';
import ReactDOM from 'react-dom';
import TabContent from './TabContent';
import { isVertical, getActiveIndex, getTransformByIndex, setTransform, getActiveKey, toArray, setTransition } from './utils';

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
  var delta = isVertical(this.props.tabBarPosition) ? e.deltaY : e.deltaX;
  var otherDelta = isVertical(this.props.tabBarPosition) ? e.deltaX : e.deltaY;
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
  _inherits(SwipeableTabContent, _React$Component);

  function SwipeableTabContent() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, SwipeableTabContent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = SwipeableTabContent.__proto__ || Object.getPrototypeOf(SwipeableTabContent)).call.apply(_ref2, [this].concat(args))), _this), _this.onPanStart = function () {
      var _this$props = _this.props,
          tabBarPosition = _this$props.tabBarPosition,
          children = _this$props.children,
          activeKey = _this$props.activeKey,
          animated = _this$props.animated;

      _this.startIndex = getActiveIndex(children, activeKey);
      var startIndex = _this.startIndex;
      if (startIndex === -1) {
        return;
      }
      if (animated) {
        setTransition(_this.rootNode.style, 'none');
      }
      _this.startDrag = true;
      _this.children = toArray(children);
      _this.maxIndex = _this.children.length - 1;
      _this.viewSize = isVertical(tabBarPosition) ? _this.rootNode.offsetHeight : _this.rootNode.offsetWidth;
    }, _this.onPan = function (e) {
      if (!_this.startDrag) {
        return;
      }
      var tabBarPosition = _this.props.tabBarPosition;

      var currentIndex = getIndexByDelta.call(_this, e);
      if (currentIndex !== undefined) {
        setTransform(_this.rootNode.style, getTransformByIndex(currentIndex, tabBarPosition));
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
        setTransition(_this.rootNode.style, '');
      }
      var currentIndex = getIndexByDelta.call(_this, e);
      var finalIndex = _this.startIndex;
      if (currentIndex !== undefined) {
        if (currentIndex < 0) {
          finalIndex = 0;
        } else if (currentIndex > _this.maxIndex) {
          finalIndex = _this.maxIndex;
        } else if (swipe) {
          var delta = isVertical(tabBarPosition) ? e.deltaY : e.deltaX;
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
          setTransform(_this.rootNode.style, getTransformByIndex(finalIndex, _this.props.tabBarPosition));
        }
      } else {
        _this.props.onChange(getActiveKey(_this.props.children, finalIndex));
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SwipeableTabContent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.rootNode = ReactDOM.findDOMNode(this);
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
        events = _extends({}, events, {
          onPan: this.onPan,
          onPanEnd: this.onPanEnd
        });
      }
      return React.createElement(
        Hammer,
        _extends({}, events, {
          direction: isVertical(tabBarPosition) ? 'DIRECTION_ALL' : 'DIRECTION_HORIZONTAL',
          options: hammerOptions
        }),
        React.createElement(TabContent, this.props)
      );
    }
  }]);

  return SwipeableTabContent;
}(React.Component);

export default SwipeableTabContent;


SwipeableTabContent.propTypes = {
  tabBarPosition: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node,
  hammerOptions: PropTypes.any,
  animated: PropTypes.bool,
  activeKey: PropTypes.string
};

SwipeableTabContent.defaultProps = {
  animated: true
};