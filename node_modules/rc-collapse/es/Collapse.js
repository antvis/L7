var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import CollapsePanel from './Panel';
import openAnimationFactory from './openAnimationFactory';
import classNames from 'classnames';
import { isFragment } from 'react-is';
import shallowEqual from 'shallowequal';
import { polyfill } from 'react-lifecycles-compat';

function toArray(activeKey) {
  var currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    currentActiveKey = currentActiveKey ? [currentActiveKey] : [];
  }
  return currentActiveKey.map(function (key) {
    return String(key);
  });
}

var Collapse = function (_Component) {
  _inherits(Collapse, _Component);

  function Collapse(props) {
    _classCallCheck(this, Collapse);

    var _this = _possibleConstructorReturn(this, (Collapse.__proto__ || Object.getPrototypeOf(Collapse)).call(this, props));

    _initialiseProps.call(_this);

    var activeKey = props.activeKey,
        defaultActiveKey = props.defaultActiveKey;

    var currentActiveKey = defaultActiveKey;
    if ('activeKey' in props) {
      currentActiveKey = activeKey;
    }

    _this.state = {
      openAnimation: props.openAnimation || openAnimationFactory(props.prefixCls),
      activeKey: toArray(currentActiveKey)
    };
    return _this;
  }

  _createClass(Collapse, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames;

      var _props = this.props,
          prefixCls = _props.prefixCls,
          className = _props.className,
          style = _props.style,
          accordion = _props.accordion;

      var collapseClassName = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls, true), _defineProperty(_classNames, className, !!className), _classNames));
      return React.createElement(
        'div',
        { className: collapseClassName, style: style, role: accordion ? 'tablist' : null },
        this.getItems()
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps) {
      var newState = {};
      if ('activeKey' in nextProps) {
        newState.activeKey = toArray(nextProps.activeKey);
      }
      if ('openAnimation' in nextProps) {
        newState.openAnimation = nextProps.openAnimation;
      }
      return newState.activeKey || newState.openAnimation ? newState : null;
    }
  }]);

  return Collapse;
}(Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onClickItem = function (key) {
    var activeKey = _this2.state.activeKey;
    if (_this2.props.accordion) {
      activeKey = activeKey[0] === key ? [] : [key];
    } else {
      activeKey = [].concat(_toConsumableArray(activeKey));
      var index = activeKey.indexOf(key);
      var isActive = index > -1;
      if (isActive) {
        // remove active state
        activeKey.splice(index, 1);
      } else {
        activeKey.push(key);
      }
    }
    _this2.setActiveKey(activeKey);
  };

  this.getNewChild = function (child, index) {
    if (!child) return null;

    var activeKey = _this2.state.activeKey;
    var _props2 = _this2.props,
        prefixCls = _props2.prefixCls,
        accordion = _props2.accordion,
        destroyInactivePanel = _props2.destroyInactivePanel,
        expandIcon = _props2.expandIcon;
    // If there is no key provide, use the panel order as default key

    var key = child.key || String(index);
    var _child$props = child.props,
        header = _child$props.header,
        headerClass = _child$props.headerClass,
        disabled = _child$props.disabled;

    var isActive = false;
    if (accordion) {
      isActive = activeKey[0] === key;
    } else {
      isActive = activeKey.indexOf(key) > -1;
    }

    var props = {
      key: key,
      panelKey: key,
      header: header,
      headerClass: headerClass,
      isActive: isActive,
      prefixCls: prefixCls,
      destroyInactivePanel: destroyInactivePanel,
      openAnimation: _this2.state.openAnimation,
      accordion: accordion,
      children: child.props.children,
      onItemClick: disabled ? null : _this2.onClickItem,
      expandIcon: expandIcon
    };

    return React.cloneElement(child, props);
  };

  this.getItems = function () {
    var children = _this2.props.children;

    var childList = isFragment(children) ? children.props.children : children;
    var newChildren = Children.map(childList, _this2.getNewChild);

    //  ref: https://github.com/ant-design/ant-design/issues/13884
    if (isFragment(children)) {
      return React.createElement(
        React.Fragment,
        null,
        newChildren
      );
    }

    return newChildren;
  };

  this.setActiveKey = function (activeKey) {
    if (!('activeKey' in _this2.props)) {
      _this2.setState({ activeKey: activeKey });
    }
    _this2.props.onChange(_this2.props.accordion ? activeKey[0] : activeKey);
  };
};

Collapse.propTypes = {
  children: PropTypes.any,
  prefixCls: PropTypes.string,
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))]),
  defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))]),
  openAnimation: PropTypes.object,
  onChange: PropTypes.func,
  accordion: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  destroyInactivePanel: PropTypes.bool,
  expandIcon: PropTypes.func
};

Collapse.defaultProps = {
  prefixCls: 'rc-collapse',
  onChange: function onChange() {},

  accordion: false,
  destroyInactivePanel: false
};

Collapse.Panel = CollapsePanel;

polyfill(Collapse);

export default Collapse;