'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

var _rcHammerjs = require('rc-hammerjs');

var _rcHammerjs2 = _interopRequireDefault(_rcHammerjs);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SwipeableTabBarNode = function (_React$Component) {
  (0, _inherits3['default'])(SwipeableTabBarNode, _React$Component);

  function SwipeableTabBarNode(props) {
    (0, _classCallCheck3['default'])(this, SwipeableTabBarNode);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (SwipeableTabBarNode.__proto__ || Object.getPrototypeOf(SwipeableTabBarNode)).call(this, props));

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

  (0, _createClass3['default'])(SwipeableTabBarNode, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var swipe = this.props.getRef('swipe');
      var nav = this.props.getRef('nav');
      var activeKey = this.props.activeKey;

      this.swipeNode = _reactDom2['default'].findDOMNode(swipe); // dom which scroll (9999px)
      this.realNode = _reactDom2['default'].findDOMNode(nav); // dom which visiable in screen (viewport)
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

      var _isVertical = (0, _utils.isVertical)(tabBarPosition);
      var _viewSize = (0, _utils.getStyle)(this.realNode, _isVertical ? 'height' : 'width');
      var _tabWidth = _viewSize / pageSize;
      this.cache = (0, _extends3['default'])({}, this.cache, {
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

      (0, _utils.setPxStyle)(this.swipeNode, totalDelta, vertical);
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
      var navClasses = (0, _classnames4['default'])((0, _defineProperty3['default'])({}, navClassName, true));
      var events = {
        onPan: this.onPan
      };
      return _react2['default'].createElement(
        'div',
        {
          className: (0, _classnames4['default'])((_classnames2 = {}, (0, _defineProperty3['default'])(_classnames2, prefixCls + '-nav-container', 1), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-nav-swipe-container', 1), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-prevpage', hasPrevPage), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-nextpage', hasNextPage), _classnames2)),
          key: 'container',
          ref: this.props.saveRef('container')
        },
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-nav-wrap', ref: this.props.saveRef('navWrap') },
          _react2['default'].createElement(
            _rcHammerjs2['default'],
            (0, _extends3['default'])({}, events, {
              direction: (0, _utils.isVertical)(tabBarPosition) ? 'DIRECTION_ALL' : 'DIRECTION_HORIZONTAL',
              options: hammerOptions
            }),
            _react2['default'].createElement(
              'div',
              { className: prefixCls + '-nav-swipe', ref: this.props.saveRef('swipe') },
              _react2['default'].createElement(
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
}(_react2['default'].Component);

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

exports['default'] = SwipeableTabBarNode;


SwipeableTabBarNode.propTypes = {
  activeKey: _propTypes2['default'].string,
  panels: _propTypes2['default'].node,
  pageSize: _propTypes2['default'].number,
  tabBarPosition: _propTypes2['default'].oneOf(['left', 'right', 'top', 'bottom']),
  prefixCls: _propTypes2['default'].string,
  children: _propTypes2['default'].node,
  hammerOptions: _propTypes2['default'].object,
  speed: _propTypes2['default'].number,
  saveRef: _propTypes2['default'].func,
  getRef: _propTypes2['default'].func
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
module.exports = exports['default'];