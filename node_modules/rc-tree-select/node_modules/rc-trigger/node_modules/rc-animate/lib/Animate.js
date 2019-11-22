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

exports.genAnimate = genAnimate;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _toArray = require('rc-util/lib/Children/toArray');

var _toArray2 = _interopRequireDefault(_toArray);

var _warning = require('fbjs/lib/warning');

var _warning2 = _interopRequireDefault(_warning);

var _AnimateChild = require('./AnimateChild');

var _AnimateChild2 = _interopRequireDefault(_AnimateChild);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var defaultKey = 'rc_animate_' + Date.now();
var clonePropList = ['children'];

/**
 * Default use `AnimateChild` as component.
 * Here can also pass customize `ChildComponent` for test usage.
 */
function genAnimate(ChildComponent) {
  var Animate = function (_React$Component) {
    (0, _inherits3['default'])(Animate, _React$Component);

    function Animate() {
      var _ref;

      var _temp, _this, _ret;

      (0, _classCallCheck3['default'])(this, Animate);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Animate.__proto__ || Object.getPrototypeOf(Animate)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
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


        return (0, _toArray2['default'])(children).some(function (node) {
          return node && node.key === key;
        });
      }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
    }
    // [Legacy] Not sure usage
    // commit: https://github.com/react-component/animate/commit/0a1cbfd647407498b10a8c6602a2dea80b42e324
    // eslint-disable-line

    (0, _createClass3['default'])(Animate, [{
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
            (0, _warning2['default'])(false, 'must set key for <rc-animate> children');
            return null;
          }

          var show = true;

          if (!_this2.hasChild(node.key)) {
            show = false;
          } else if (showProp) {
            show = node.props[showProp];
          }

          var key = node.key || defaultKey;

          return _react2['default'].createElement(
            ChildComponent,
            (0, _extends3['default'])({}, _this2.props, {
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
            passedProps = (0, _extends3['default'])({
              className: className,
              style: style
            }, componentProps);
          }

          return _react2['default'].createElement(
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
          prevProps: (0, _util.cloneProps)(nextProps, clonePropList)
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
          var currentChildren = (0, _toArray2['default'])(children).filter(function (node) {
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
          newState.mergedChildren = (0, _util.mergeChildren)(prevChildren, currentChildren);
        });

        return newState;
      }
    }]);
    return Animate;
  }(_react2['default'].Component);

  Animate.isAnimate = true;
  Animate.propTypes = {
    component: _propTypes2['default'].any,
    componentProps: _propTypes2['default'].object,
    animation: _propTypes2['default'].object,
    transitionName: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].object]),
    transitionEnter: _propTypes2['default'].bool,
    transitionAppear: _propTypes2['default'].bool,
    exclusive: _propTypes2['default'].bool,
    transitionLeave: _propTypes2['default'].bool,
    onEnd: _propTypes2['default'].func,
    onEnter: _propTypes2['default'].func,
    onLeave: _propTypes2['default'].func,
    onAppear: _propTypes2['default'].func,
    showProp: _propTypes2['default'].string,
    children: _propTypes2['default'].node,
    style: _propTypes2['default'].object,
    className: _propTypes2['default'].string
  };
  Animate.defaultProps = {
    animation: {},
    component: 'span',
    componentProps: {},
    transitionEnter: true,
    transitionLeave: true,
    transitionAppear: false
  };


  (0, _reactLifecyclesCompat.polyfill)(Animate);

  return Animate;
}

exports['default'] = genAnimate(_AnimateChild2['default']);