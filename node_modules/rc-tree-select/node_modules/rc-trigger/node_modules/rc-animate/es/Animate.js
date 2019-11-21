import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import toArray from 'rc-util/es/Children/toArray';
import warning from 'fbjs/lib/warning';

import AnimateChild from './AnimateChild';
import { cloneProps, mergeChildren } from './util';

var defaultKey = 'rc_animate_' + Date.now();
var clonePropList = ['children'];

/**
 * Default use `AnimateChild` as component.
 * Here can also pass customize `ChildComponent` for test usage.
 */
export function genAnimate(ChildComponent) {
  var Animate = function (_React$Component) {
    _inherits(Animate, _React$Component);

    function Animate() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Animate);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Animate.__proto__ || Object.getPrototypeOf(Animate)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        appeared: true,
        mergedChildren: []
      }, _this.onChildLeaved = function (key) {
        // Remove child which not exist anymore
        if (!_this.hasChild(key)) {
          var mergedChildren = _this.state.mergedChildren;

          _this.setState({
            mergedChildren: mergedChildren.filter(function (node) {
              return node.key !== key;
            })
          });
        }
      }, _this.hasChild = function (key) {
        var children = _this.props.children;


        return toArray(children).some(function (node) {
          return node && node.key === key;
        });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    // [Legacy] Not sure usage
    // commit: https://github.com/react-component/animate/commit/0a1cbfd647407498b10a8c6602a2dea80b42e324
    // eslint-disable-line

    _createClass(Animate, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        // No need to re-render
        this.state.appeared = false;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _state = this.state,
            appeared = _state.appeared,
            mergedChildren = _state.mergedChildren;
        var _props = this.props,
            Component = _props.component,
            componentProps = _props.componentProps,
            className = _props.className,
            style = _props.style,
            showProp = _props.showProp;


        var $children = mergedChildren.map(function (node) {
          if (mergedChildren.length > 1 && !node.key) {
            warning(false, 'must set key for <rc-animate> children');
            return null;
          }

          var show = true;

          if (!_this2.hasChild(node.key)) {
            show = false;
          } else if (showProp) {
            show = node.props[showProp];
          }

          var key = node.key || defaultKey;

          return React.createElement(
            ChildComponent,
            _extends({}, _this2.props, {
              appeared: appeared,
              show: show,
              className: node.props.className,
              style: node.props.style,
              key: key,

              animateKey: node.key // Keep trans origin key
              , onChildLeaved: _this2.onChildLeaved
            }),
            node
          );
        });

        // Wrap with component
        if (Component) {
          var passedProps = this.props;
          if (typeof Component === 'string') {
            passedProps = _extends({
              className: className,
              style: style
            }, componentProps);
          }

          return React.createElement(
            Component,
            passedProps,
            $children
          );
        }

        return $children[0] || null;
      }
    }], [{
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(nextProps, prevState) {
        var _prevState$prevProps = prevState.prevProps,
            prevProps = _prevState$prevProps === undefined ? {} : _prevState$prevProps;

        var newState = {
          prevProps: cloneProps(nextProps, clonePropList)
        };
        var showProp = nextProps.showProp;


        function processState(propName, updater) {
          if (prevProps[propName] !== nextProps[propName]) {
            updater(nextProps[propName]);
            return true;
          }
          return false;
        }

        processState('children', function (children) {
          var currentChildren = toArray(children).filter(function (node) {
            return node;
          });
          var prevChildren = prevState.mergedChildren.filter(function (node) {
            // Remove prev child if not show anymore
            if (currentChildren.every(function (_ref2) {
              var key = _ref2.key;
              return key !== node.key;
            }) && showProp && !node.props[showProp]) {
              return false;
            }
            return true;
          });

          // Merge prev children to keep the animation
          newState.mergedChildren = mergeChildren(prevChildren, currentChildren);
        });

        return newState;
      }
    }]);

    return Animate;
  }(React.Component);

  Animate.isAnimate = true;
  Animate.propTypes = {
    component: PropTypes.any,
    componentProps: PropTypes.object,
    animation: PropTypes.object,
    transitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    transitionEnter: PropTypes.bool,
    transitionAppear: PropTypes.bool,
    exclusive: PropTypes.bool,
    transitionLeave: PropTypes.bool,
    onEnd: PropTypes.func,
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
    onAppear: PropTypes.func,
    showProp: PropTypes.string,
    children: PropTypes.node,
    style: PropTypes.object,
    className: PropTypes.string
  };
  Animate.defaultProps = {
    animation: {},
    component: 'span',
    componentProps: {},
    transitionEnter: true,
    transitionLeave: true,
    transitionAppear: false
  };


  polyfill(Animate);

  return Animate;
}

export default genAnimate(AnimateChild);