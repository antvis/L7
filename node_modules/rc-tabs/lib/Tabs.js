'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _KeyCode = require('./KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _TabPane = require('./TabPane');

var _TabPane2 = _interopRequireDefault(_TabPane);

var _utils = require('./utils');

var _Sentinel = require('./Sentinel');

var _Sentinel2 = _interopRequireDefault(_Sentinel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function getDefaultActiveKey(props) {
  var activeKey = void 0;
  _react2['default'].Children.forEach(props.children, function (child) {
    if (child && !activeKey && !child.props.disabled) {
      activeKey = child.key;
    }
  });
  return activeKey;
}

function activeKeyIsValid(props, key) {
  var keys = _react2['default'].Children.map(props.children, function (child) {
    return child && child.key;
  });
  return keys.indexOf(key) >= 0;
}

var Tabs = function (_React$Component) {
  (0, _inherits3['default'])(Tabs, _React$Component);

  function Tabs(props) {
    (0, _classCallCheck3['default'])(this, Tabs);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, props));

    _initialiseProps.call(_this);

    var activeKey = void 0;
    if ('activeKey' in props) {
      activeKey = props.activeKey;
    } else if ('defaultActiveKey' in props) {
      activeKey = props.defaultActiveKey;
    } else {
      activeKey = getDefaultActiveKey(props);
    }

    _this.state = {
      activeKey: activeKey
    };
    return _this;
  }

  (0, _createClass3['default'])(Tabs, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.destroy = true;
      _raf2['default'].cancel(this.sentinelId);
    }

    // Sentinel for tab index

  }, {
    key: 'updateSentinelContext',
    value: function updateSentinelContext() {
      var _this2 = this;

      if (this.destroy) return;

      _raf2['default'].cancel(this.sentinelId);
      this.sentinelId = (0, _raf2['default'])(function () {
        if (_this2.destroy) return;
        _this2.forceUpdate();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _classnames;

      var props = this.props;
      var prefixCls = props.prefixCls,
          navWrapper = props.navWrapper,
          tabBarPosition = props.tabBarPosition,
          className = props.className,
          renderTabContent = props.renderTabContent,
          renderTabBar = props.renderTabBar,
          destroyInactiveTabPane = props.destroyInactiveTabPane,
          restProps = (0, _objectWithoutProperties3['default'])(props, ['prefixCls', 'navWrapper', 'tabBarPosition', 'className', 'renderTabContent', 'renderTabBar', 'destroyInactiveTabPane']);

      var cls = (0, _classnames3['default'])((_classnames = {}, (0, _defineProperty3['default'])(_classnames, prefixCls, 1), (0, _defineProperty3['default'])(_classnames, prefixCls + '-' + tabBarPosition, 1), (0, _defineProperty3['default'])(_classnames, className, !!className), _classnames));

      this.tabBar = renderTabBar();

      var tabBar = _react2['default'].cloneElement(this.tabBar, {
        prefixCls: prefixCls,
        navWrapper: navWrapper,
        key: 'tabBar',
        onKeyDown: this.onNavKeyDown,
        tabBarPosition: tabBarPosition,
        onTabClick: this.onTabClick,
        panels: props.children,
        activeKey: this.state.activeKey
      });

      var tabContent = _react2['default'].cloneElement(renderTabContent(), {
        prefixCls: prefixCls,
        tabBarPosition: tabBarPosition,
        activeKey: this.state.activeKey,
        destroyInactiveTabPane: destroyInactiveTabPane,
        children: props.children,
        onChange: this.setActiveKey,
        key: 'tabContent'
      });

      var sentinelStart = _react2['default'].createElement(_Sentinel2['default'], {
        key: 'sentinelStart',
        setRef: this.setSentinelStart,
        nextElement: this.panelSentinelStart
      });
      var sentinelEnd = _react2['default'].createElement(_Sentinel2['default'], {
        key: 'sentinelEnd',
        setRef: this.setSentinelEnd,
        prevElement: this.panelSentinelEnd
      });

      var contents = [];
      if (tabBarPosition === 'bottom') {
        contents.push(sentinelStart, tabContent, sentinelEnd, tabBar);
      } else {
        contents.push(tabBar, sentinelStart, tabContent, sentinelEnd);
      }

      return _react2['default'].createElement(
        _Sentinel.SentinelProvider,
        {
          value: {
            sentinelStart: this.sentinelStart,
            sentinelEnd: this.sentinelEnd,
            setPanelSentinelStart: this.setPanelSentinelStart,
            setPanelSentinelEnd: this.setPanelSentinelEnd
          }
        },
        _react2['default'].createElement(
          'div',
          (0, _extends3['default'])({
            className: cls,
            style: props.style
          }, (0, _utils.getDataAttr)(restProps), {
            onScroll: this.onScroll
          }),
          contents
        )
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(props, state) {
      var newState = {};
      if ('activeKey' in props) {
        newState.activeKey = props.activeKey;
      } else if (!activeKeyIsValid(props, state.activeKey)) {
        newState.activeKey = getDefaultActiveKey(props);
      }
      if (Object.keys(newState).length > 0) {
        return newState;
      }
      return null;
    }
  }]);
  return Tabs;
}(_react2['default'].Component);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onTabClick = function (activeKey, e) {
    if (_this3.tabBar.props.onTabClick) {
      _this3.tabBar.props.onTabClick(activeKey, e);
    }
    _this3.setActiveKey(activeKey);
  };

  this.onNavKeyDown = function (e) {
    var eventKeyCode = e.keyCode;
    if (eventKeyCode === _KeyCode2['default'].RIGHT || eventKeyCode === _KeyCode2['default'].DOWN) {
      e.preventDefault();
      var nextKey = _this3.getNextActiveKey(true);
      _this3.onTabClick(nextKey);
    } else if (eventKeyCode === _KeyCode2['default'].LEFT || eventKeyCode === _KeyCode2['default'].UP) {
      e.preventDefault();
      var previousKey = _this3.getNextActiveKey(false);
      _this3.onTabClick(previousKey);
    }
  };

  this.onScroll = function (_ref) {
    var target = _ref.target,
        currentTarget = _ref.currentTarget;

    if (target === currentTarget && target.scrollLeft > 0) {
      target.scrollLeft = 0;
    }
  };

  this.setSentinelStart = function (node) {
    _this3.sentinelStart = node;
  };

  this.setSentinelEnd = function (node) {
    _this3.sentinelEnd = node;
  };

  this.setPanelSentinelStart = function (node) {
    if (node !== _this3.panelSentinelStart) {
      _this3.updateSentinelContext();
    }
    _this3.panelSentinelStart = node;
  };

  this.setPanelSentinelEnd = function (node) {
    if (node !== _this3.panelSentinelEnd) {
      _this3.updateSentinelContext();
    }
    _this3.panelSentinelEnd = node;
  };

  this.setActiveKey = function (activeKey) {
    if (_this3.state.activeKey !== activeKey) {
      if (!('activeKey' in _this3.props)) {
        _this3.setState({
          activeKey: activeKey
        });
      }
      _this3.props.onChange(activeKey);
    }
  };

  this.getNextActiveKey = function (next) {
    var activeKey = _this3.state.activeKey;
    var children = [];
    _react2['default'].Children.forEach(_this3.props.children, function (c) {
      if (c && !c.props.disabled) {
        if (next) {
          children.push(c);
        } else {
          children.unshift(c);
        }
      }
    });
    var length = children.length;
    var ret = length && children[0].key;
    children.forEach(function (child, i) {
      if (child.key === activeKey) {
        if (i === length - 1) {
          ret = children[0].key;
        } else {
          ret = children[i + 1].key;
        }
      }
    });
    return ret;
  };
};

Tabs.propTypes = {
  destroyInactiveTabPane: _propTypes2['default'].bool,
  renderTabBar: _propTypes2['default'].func.isRequired,
  renderTabContent: _propTypes2['default'].func.isRequired,
  navWrapper: _propTypes2['default'].func,
  onChange: _propTypes2['default'].func,
  children: _propTypes2['default'].node,
  prefixCls: _propTypes2['default'].string,
  className: _propTypes2['default'].string,
  tabBarPosition: _propTypes2['default'].string,
  style: _propTypes2['default'].object,
  activeKey: _propTypes2['default'].string,
  defaultActiveKey: _propTypes2['default'].string
};

Tabs.defaultProps = {
  prefixCls: 'rc-tabs',
  destroyInactiveTabPane: false,
  onChange: noop,
  navWrapper: function navWrapper(arg) {
    return arg;
  },
  tabBarPosition: 'top',
  children: null,
  style: {}
};

Tabs.TabPane = _TabPane2['default'];

(0, _reactLifecyclesCompat.polyfill)(Tabs);

exports['default'] = Tabs;
module.exports = exports['default'];