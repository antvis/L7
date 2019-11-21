'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.genAnimateChild = genAnimateChild;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _componentClasses = require('component-classes');

var _componentClasses2 = _interopRequireDefault(_componentClasses);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var clonePropList = ['appeared', 'show', 'exclusive', 'children', 'animation'];

/**
 * AnimateChild only accept one child node.
 * `transitionSupport` is used for none transition test case.
 * Default we use browser transition event support check.
 */
function genAnimateChild(transitionSupport) {
  var AnimateChild = function (_React$Component) {
    (0, _inherits3['default'])(AnimateChild, _React$Component);

    function AnimateChild() {
      (0, _classCallCheck3['default'])(this, AnimateChild);

      // [Legacy] Since old code addListener on the element.
      // To avoid break the behaviour that component not handle animation/transition
      // also can handle the animate, let keep the logic.
      var _this = (0, _possibleConstructorReturn3['default'])(this, (AnimateChild.__proto__ || Object.getPrototypeOf(AnimateChild)).call(this));

      _this.state = {
        child: null,

        eventQueue: [],
        eventActive: false
      };

      _this.onDomUpdated = function () {
        var eventActive = _this.state.eventActive;
        var _this$props = _this.props,
            transitionName = _this$props.transitionName,
            animation = _this$props.animation,
            onChildLeaved = _this$props.onChildLeaved,
            animateKey = _this$props.animateKey;


        var $ele = _this.getDomElement();

        // Skip if dom element not ready
        if (!$ele) return;

        // [Legacy] Add animation/transition event by dom level
        if (transitionSupport && _this.$prevEle !== $ele) {
          _this.cleanDomEvent();

          _this.$prevEle = $ele;
          _this.$prevEle.addEventListener(_util.animationEndName, _this.onMotionEnd);
          _this.$prevEle.addEventListener(_util.transitionEndName, _this.onMotionEnd);
        }

        var currentEvent = _this.getCurrentEvent();
        if (currentEvent.empty) {
          // Additional process the leave event
          if (currentEvent.lastEventType === 'leave') {
            onChildLeaved(animateKey);
          }
          return;
        }

        var eventType = currentEvent.eventType,
            restQueue = currentEvent.restQueue;

        var nodeClasses = (0, _componentClasses2['default'])($ele);

        // [Legacy] Since origin code use js to set `className`.
        // This caused that any component without support `className` can be forced set.
        // Let's keep the logic.
        function legacyAppendClass() {
          if (!transitionSupport) return;

          var basicClassName = (0, _util.getTransitionName)(transitionName, '' + eventType);
          if (basicClassName) nodeClasses.add(basicClassName);

          if (eventActive) {
            var activeClassName = (0, _util.getTransitionName)(transitionName, eventType + '-active');
            if (activeClassName) nodeClasses.add(activeClassName);
          }
        }

        if (_this.currentEvent && _this.currentEvent.type === eventType) {
          legacyAppendClass();
          return;
        }

        // Clear timeout for legacy check
        clearTimeout(_this.timeout);

        // Clean up last event environment
        if (_this.currentEvent && _this.currentEvent.animateObj && _this.currentEvent.animateObj.stop) {
          _this.currentEvent.animateObj.stop();
        }

        // Clean up last transition class
        if (_this.currentEvent) {
          var basicClassName = (0, _util.getTransitionName)(transitionName, '' + _this.currentEvent.type);
          var activeClassName = (0, _util.getTransitionName)(transitionName, _this.currentEvent.type + '-active');
          if (basicClassName) nodeClasses.remove(basicClassName);
          if (activeClassName) nodeClasses.remove(activeClassName);
        }

        // New event come
        _this.currentEvent = {
          type: eventType
        };

        var animationHandler = (animation || {})[eventType];
        // =============== Check if has customize animation ===============
        if (animationHandler) {
          _this.currentEvent.animateObj = animationHandler($ele, function () {
            _this.onMotionEnd({ target: $ele });
          });

          // Do next step if not animate object provided
          if (!_this.currentEvent || !_this.currentEvent.animateObj) {
            _this.nextEvent(restQueue);
          }

          // ==================== Use transition instead ====================
        } else if (transitionSupport) {
          legacyAppendClass();
          if (!eventActive) {
            // Trigger `eventActive` in next frame
            (0, _raf2['default'])(function () {
              if (_this.currentEvent && _this.currentEvent.type === eventType && !_this._destroy) {
                _this.setState({ eventActive: true }, function () {
                  // [Legacy] Handle timeout if browser transition event not handle
                  var transitionDelay = (0, _util.getStyleValue)($ele, 'transition-delay') || 0;
                  var transitionDuration = (0, _util.getStyleValue)($ele, 'transition-duration') || 0;
                  var animationDelay = (0, _util.getStyleValue)($ele, 'animation-delay') || 0;
                  var animationDuration = (0, _util.getStyleValue)($ele, 'animation-duration') || 0;
                  var totalTime = Math.max(transitionDuration + transitionDelay, animationDuration + animationDelay);

                  if (totalTime >= 0) {
                    _this.timeout = setTimeout(function () {
                      _this.onMotionEnd({ target: $ele });
                    }, totalTime * 1000);
                  }
                });
              }
            });
          }

          // ======================= Just next action =======================
        } else {
          _this.onMotionEnd({ target: $ele });
        }
      };

      _this.onMotionEnd = function (_ref) {
        var target = _ref.target;
        var _this$props2 = _this.props,
            transitionName = _this$props2.transitionName,
            onChildLeaved = _this$props2.onChildLeaved,
            animateKey = _this$props2.animateKey,
            onAppear = _this$props2.onAppear,
            onEnter = _this$props2.onEnter,
            onLeave = _this$props2.onLeave,
            onEnd = _this$props2.onEnd;

        var currentEvent = _this.getCurrentEvent();
        if (currentEvent.empty) return;

        // Clear timeout for legacy check
        clearTimeout(_this.timeout);

        var restQueue = currentEvent.restQueue;


        var $ele = _this.getDomElement();
        if (!_this.currentEvent || $ele !== target) return;

        if (_this.currentEvent.animateObj && _this.currentEvent.animateObj.stop) {
          _this.currentEvent.animateObj.stop();
        }

        // [Legacy] Same as above, we need call js to remove the class
        if (transitionSupport && _this.currentEvent) {
          var basicClassName = (0, _util.getTransitionName)(transitionName, _this.currentEvent.type);
          var activeClassName = (0, _util.getTransitionName)(transitionName, _this.currentEvent.type + '-active');

          var nodeClasses = (0, _componentClasses2['default'])($ele);
          if (basicClassName) nodeClasses.remove(basicClassName);
          if (activeClassName) nodeClasses.remove(activeClassName);
        }

        // Additional process the leave event
        if (_this.currentEvent && _this.currentEvent.type === 'leave') {
          onChildLeaved(animateKey);
        }

        // [Legacy] Trigger on event when it's last event
        if (_this.currentEvent && !restQueue.length) {
          if (_this.currentEvent.type === 'appear' && onAppear) {
            onAppear(animateKey);
          } else if (_this.currentEvent.type === 'enter' && onEnter) {
            onEnter(animateKey);
          } else if (_this.currentEvent.type === 'leave' && onLeave) {
            onLeave(animateKey);
          }

          if (onEnd) {
            // OnEnd(key, isShow)
            onEnd(animateKey, _this.currentEvent.type !== 'leave');
          }
        }

        _this.currentEvent = null;

        // Next queue
        _this.nextEvent(restQueue);
      };

      _this.getDomElement = function () {
        if (_this._destroy) return null;
        return _reactDom2['default'].findDOMNode(_this);
      };

      _this.getCurrentEvent = function () {
        var _this$state$eventQueu = _this.state.eventQueue,
            eventQueue = _this$state$eventQueu === undefined ? [] : _this$state$eventQueu;
        var _this$props3 = _this.props,
            animation = _this$props3.animation,
            exclusive = _this$props3.exclusive,
            transitionAppear = _this$props3.transitionAppear,
            transitionEnter = _this$props3.transitionEnter,
            transitionLeave = _this$props3.transitionLeave;


        function hasEventHandler(eventType) {
          return eventType === 'appear' && (transitionAppear || animation.appear) || eventType === 'enter' && (transitionEnter || animation.enter) || eventType === 'leave' && (transitionLeave || animation.leave);
        }

        var event = null;
        // If is exclusive, only check the last event
        if (exclusive) {
          var eventType = eventQueue[eventQueue.length - 1];
          if (hasEventHandler(eventType)) {
            event = {
              eventType: eventType,
              restQueue: []
            };
          }
        } else {
          // Loop check the queue until find match
          var cloneQueue = eventQueue.slice();
          while (cloneQueue.length) {
            var _cloneQueue = cloneQueue,
                _cloneQueue2 = (0, _toArray3['default'])(_cloneQueue),
                _eventType = _cloneQueue2[0],
                restQueue = _cloneQueue2.slice(1);

            if (hasEventHandler(_eventType)) {
              event = {
                eventType: _eventType,
                restQueue: restQueue
              };
              break;
            }
            cloneQueue = restQueue;
          }
        }

        if (!event) {
          event = {
            empty: true,
            lastEventType: eventQueue[eventQueue.length - 1]
          };
        }

        return event;
      };

      _this.nextEvent = function (restQueue) {
        // Next queue
        if (!_this._destroy) {
          _this.setState({
            eventQueue: restQueue,
            eventActive: false
          });
        }
      };

      _this.cleanDomEvent = function () {
        if (_this.$prevEle && transitionSupport) {
          _this.$prevEle.removeEventListener(_util.animationEndName, _this.onMotionEnd);
          _this.$prevEle.removeEventListener(_util.transitionEndName, _this.onMotionEnd);
        }
      };

      _this.$prevEle = null;

      _this.currentEvent = null;
      _this.timeout = null;
      return _this;
    }

    (0, _createClass3['default'])(AnimateChild, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.onDomUpdated();
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.onDomUpdated();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        clearTimeout(this.timeout);
        this._destroy = true;
        this.cleanDomEvent();
      }
    }, {
      key: 'render',
      value: function render() {
        var _state = this.state,
            child = _state.child,
            eventActive = _state.eventActive;
        var _props = this.props,
            showProp = _props.showProp,
            transitionName = _props.transitionName;

        var _ref2 = child.props || {},
            className = _ref2.className;

        var currentEvent = this.getCurrentEvent();

        // Class name
        var connectClassName = transitionSupport && this.currentEvent ? (0, _classnames2['default'])(className, (0, _util.getTransitionName)(transitionName, this.currentEvent.type), eventActive && (0, _util.getTransitionName)(transitionName, this.currentEvent.type + '-active')) : className;

        var show = true;

        // Keep show when is in transition or has customize animate
        if (transitionSupport && (!currentEvent.empty || this.currentEvent && this.currentEvent.animateObj)) {
          show = true;
        } else {
          show = child.props[showProp];
        }

        // Clone child
        var newChildProps = {
          className: connectClassName
        };

        if (showProp) {
          newChildProps[showProp] = show;
        }

        return _react2['default'].cloneElement(child, newChildProps);
      }
    }], [{
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(nextProps, prevState) {
        var _prevState$prevProps = prevState.prevProps,
            prevProps = _prevState$prevProps === undefined ? {} : _prevState$prevProps;
        var appeared = nextProps.appeared;


        var newState = {
          prevProps: (0, _util.cloneProps)(nextProps, clonePropList)
        };

        function processState(propName, updater) {
          if (prevProps[propName] !== nextProps[propName]) {
            if (updater) {
              updater(nextProps[propName]);
            }
            return true;
          }
          return false;
        }

        function pushEvent(eventType) {
          var eventQueue = newState.eventQueue || prevState.eventQueue.slice();
          var matchIndex = eventQueue.indexOf(eventType);

          // Clean the rest event if eventType match
          if (matchIndex !== -1) {
            eventQueue = eventQueue.slice(0, matchIndex);
          }

          eventQueue.push(eventType);
          newState.eventQueue = eventQueue;
        }

        // Child update. Only set child.
        processState('children', function (child) {
          newState.child = child;
        });

        processState('appeared', function (isAppeared) {
          if (isAppeared) {
            pushEvent('appear');
          }
        });

        // Show update
        processState('show', function (show) {
          if (!appeared) {
            if (show) {
              pushEvent('enter');
            } else {
              pushEvent('leave');
            }
          }
        });

        return newState;
      }
    }]);
    return AnimateChild;
  }(_react2['default'].Component);

  AnimateChild.propTypes = {
    transitionName: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].object]),
    transitionAppear: _propTypes2['default'].bool,
    transitionEnter: _propTypes2['default'].bool,
    transitionLeave: _propTypes2['default'].bool,
    exclusive: _propTypes2['default'].bool,
    appeared: _propTypes2['default'].bool,
    showProp: _propTypes2['default'].string,

    animateKey: _propTypes2['default'].any,
    animation: _propTypes2['default'].object,
    onChildLeaved: _propTypes2['default'].func,

    onEnd: _propTypes2['default'].func,
    onAppear: _propTypes2['default'].func,
    onEnter: _propTypes2['default'].func,
    onLeave: _propTypes2['default'].func
  };


  (0, _reactLifecyclesCompat.polyfill)(AnimateChild);

  return AnimateChild;
}

exports['default'] = genAnimateChild(_util.supportTransition);