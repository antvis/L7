import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Hammer from 'rc-hammerjs';
import ReactDOM from 'react-dom';
import { isVertical, getStyle, setPxStyle } from './utils';

var SwipeableTabBarNode = function (_React$Component) {
  _inherits(SwipeableTabBarNode, _React$Component);

  function SwipeableTabBarNode(props) {
    _classCallCheck(this, SwipeableTabBarNode);

    var _this = _possibleConstructorReturn(this, (SwipeableTabBarNode.__proto__ || Object.getPrototypeOf(SwipeableTabBarNode)).call(this, props));

    _initialiseProps.call(_this);

    var _this$checkPagination = _this.checkPaginationByKey(_this.props.activeKey),
        hasPrevPage = _this$checkPagination.hasPrevPage,
        hasNextPage = _this$checkPagination.hasNextPage;

    _this.state = {
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage
    };
    return _this;
  }

  _createClass(SwipeableTabBarNode, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var swipe = this.props.getRef('swipe');
      var nav = this.props.getRef('nav');
      var activeKey = this.props.activeKey;

      this.swipeNode = ReactDOM.findDOMNode(swipe); // dom which scroll (9999px)
      this.realNode = ReactDOM.findDOMNode(nav); // dom which visiable in screen (viewport)
      this.setCache();
      this.setSwipePositionByKey(activeKey);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.setCache();
      if (this.props.activeKey && this.props.activeKey !== prevProps.activeKey || this.props.panels.length !== prevProps.panels.length || this.props.pageSize !== prevProps.pageSize) {
        this.setSwipePositionByKey(this.props.activeKey);
      }
    }
  }, {
    key: 'setCache',
    value: function setCache() {
      var _props = this.props,
          tabBarPosition = _props.tabBarPosition,
          pageSize = _props.pageSize,
          panels = _props.panels;

      var _isVertical = isVertical(tabBarPosition);
      var _viewSize = getStyle(this.realNode, _isVertical ? 'height' : 'width');
      var _tabWidth = _viewSize / pageSize;
      this.cache = _extends({}, this.cache, {
        vertical: _isVertical,
        totalAvaliableDelta: _tabWidth * panels.length - _viewSize,
        tabWidth: _tabWidth
      });
    }

    /**
     * used for props.activeKey setting, not for swipe callback
     */

  }, {
    key: 'getDeltaByKey',
    value: function getDeltaByKey(activeKey) {
      var pageSize = this.props.pageSize;

      var index = this.getIndexByKey(activeKey);
      var centerTabCount = Math.floor(pageSize / 2);
      var tabWidth = this.cache.tabWidth;

      var delta = (index - centerTabCount) * tabWidth * -1;
      return delta;
    }
  }, {
    key: 'getIndexByKey',
    value: function getIndexByKey(activeKey) {
      var panels = this.props.panels;

      var length = panels.length;
      for (var i = 0; i < length; i++) {
        if (panels[i].key === activeKey) {
          return i;
        }
      }
      return -1;
    }
  }, {
    key: 'setSwipePositionByKey',
    value: function setSwipePositionByKey(activeKey) {
      var _checkPaginationByKey = this.checkPaginationByKey(activeKey),
          hasPrevPage = _checkPaginationByKey.hasPrevPage,
          hasNextPage = _checkPaginationByKey.hasNextPage;

      var totalAvaliableDelta = this.cache.totalAvaliableDelta;

      this.setState({
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage
      });
      var delta = void 0;
      if (!hasPrevPage) {
        // the first page
        delta = 0;
      } else if (!hasNextPage) {
        // the last page
        delta = -totalAvaliableDelta;
      } else if (hasNextPage) {
        // the middle page
        delta = this.getDeltaByKey(activeKey);
      }
      this.cache.totalDelta = delta;
      this.setSwipePosition();
    }
  }, {
    key: 'setSwipePosition',
    value: function setSwipePosition() {
      var _cache = this.cache,
          totalDelta = _cache.totalDelta,
          vertical = _cache.vertical;

      setPxStyle(this.swipeNode, totalDelta, vertical);
    }
  }, {
    key: 'checkPaginationByKey',
    value: function checkPaginationByKey(activeKey) {
      var _props2 = this.props,
          panels = _props2.panels,
          pageSize = _props2.pageSize;

      var index = this.getIndexByKey(activeKey);
      var centerTabCount = Math.floor(pageSize / 2);
      // the basic rule is to make activeTab be shown in the center of TabBar viewport
      return {
        hasPrevPage: index - centerTabCount > 0,
        hasNextPage: index + centerTabCount < panels.length
      };
    }
  }, {
    key: 'checkPaginationByDelta',
    value: function checkPaginationByDelta(delta) {
      var totalAvaliableDelta = this.cache.totalAvaliableDelta;

      return {
        hasPrevPage: delta < 0,
        hasNextPage: -delta < totalAvaliableDelta
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _classnames2;

      var _props3 = this.props,
          prefixCls = _props3.prefixCls,
          hammerOptions = _props3.hammerOptions,
          tabBarPosition = _props3.tabBarPosition;
      var _state = this.state,
          hasPrevPage = _state.hasPrevPage,
          hasNextPage = _state.hasNextPage;

      var navClassName = prefixCls + '-nav';
      var navClasses = classnames(_defineProperty({}, navClassName, true));
      var events = {
        onPan: this.onPan
      };
      return React.createElement(
        'div',
        {
          className: classnames((_classnames2 = {}, _defineProperty(_classnames2, prefixCls + '-nav-container', 1), _defineProperty(_classnames2, prefixCls + '-nav-swipe-container', 1), _defineProperty(_classnames2, prefixCls + '-prevpage', hasPrevPage), _defineProperty(_classnames2, prefixCls + '-nextpage', hasNextPage), _classnames2)),
          key: 'container',
          ref: this.props.saveRef('container')
        },
        React.createElement(
          'div',
          { className: prefixCls + '-nav-wrap', ref: this.props.saveRef('navWrap') },
          React.createElement(
            Hammer,
            _extends({}, events, {
              direction: isVertical(tabBarPosition) ? 'DIRECTION_ALL' : 'DIRECTION_HORIZONTAL',
              options: hammerOptions
            }),
            React.createElement(
              'div',
              { className: prefixCls + '-nav-swipe', ref: this.props.saveRef('swipe') },
              React.createElement(
                'div',
                { className: navClasses, ref: this.props.saveRef('nav') },
                this.props.children
              )
            )
          )
        )
      );
    }
  }]);

  return SwipeableTabBarNode;
}(React.Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onPan = function (e) {
    var _cache2 = _this2.cache,
        vertical = _cache2.vertical,
        totalAvaliableDelta = _cache2.totalAvaliableDelta,
        totalDelta = _cache2.totalDelta;
    var speed = _this2.props.speed;
    // calculate touch distance

    var nowDelta = vertical ? e.deltaY : e.deltaX;
    nowDelta *= speed / 10;

    // calculate distance dom need transform
    var _nextDelta = nowDelta + totalDelta;
    if (_nextDelta >= 0) {
      _nextDelta = 0;
    } else if (_nextDelta <= -totalAvaliableDelta) {
      _nextDelta = -totalAvaliableDelta;
    }

    _this2.cache.totalDelta = _nextDelta;
    _this2.setSwipePosition();

    // calculate pagination display

    var _checkPaginationByDel = _this2.checkPaginationByDelta(_this2.cache.totalDelta),
        hasPrevPage = _checkPaginationByDel.hasPrevPage,
        hasNextPage = _checkPaginationByDel.hasNextPage;

    if (hasPrevPage !== _this2.state.hasPrevPage || hasNextPage !== _this2.state.hasNextPage) {
      _this2.setState({
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage
      });
    }
  };
};

export default SwipeableTabBarNode;


SwipeableTabBarNode.propTypes = {
  activeKey: PropTypes.string,
  panels: PropTypes.node,
  pageSize: PropTypes.number,
  tabBarPosition: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  prefixCls: PropTypes.string,
  children: PropTypes.node,
  hammerOptions: PropTypes.object,
  speed: PropTypes.number,
  saveRef: PropTypes.func,
  getRef: PropTypes.func
};

SwipeableTabBarNode.defaultProps = {
  panels: null,
  tabBarPosition: 'top',
  prefixCls: '',
  children: null,
  hammerOptions: {},
  pageSize: 5, // per page show how many tabs
  speed: 7, // swipe speed, 1 to 10, more bigger more faster
  saveRef: function saveRef() {},
  getRef: function getRef() {}
};