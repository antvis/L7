'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// https://github.com/hammerjs/hammer.js/issues/930
// https://github.com/JedWatson/react-hammerjs/issues/14
// require('hammerjs') when in a browser. This is safe because Hammer is only
// invoked in componentDidMount, which is not executed on the server.
var Hammer = typeof window !== 'undefined' ? require('hammerjs') : undefined;

var privateProps = {
	children: true,
	direction: true,
	options: true,
	recognizeWith: true,
	vertical: true
};

/**
 * Hammer Component
 * ================
 */

var handlerToEvent = {
	action: 'tap press',
	onDoubleTap: 'doubletap',
	onPan: 'pan',
	onPanCancel: 'pancancel',
	onPanEnd: 'panend',
	onPanStart: 'panstart',
	onPinch: 'pinch',
	onPinchCancel: 'pinchcancel',
	onPinchEnd: 'pinchend',
	onPinchIn: 'pinchin',
	onPinchOut: 'pinchout',
	onPinchStart: 'pinchstart',
	onPress: 'press',
	onPressUp: 'pressup',
	onRotate: 'rotate',
	onRotateCancel: 'rotatecancel',
	onRotateEnd: 'rotateend',
	onRotateMove: 'rotatemove',
	onRotateStart: 'rotatestart',
	onSwipe: 'swipe',
	onSwipeRight: 'swiperight',
	onSwipeLeft: 'swipeleft',
	onSwipeUp: 'swipeup',
	onSwipeDown: 'swipedown',
	onTap: 'tap'
};

Object.keys(handlerToEvent).forEach(function (i) {
	privateProps[i] = true;
});

function updateHammer(hammer, props) {
	var _this = this;

	if (props.hasOwnProperty('vertical')) {
		console.warn('vertical is deprecated, please use `direction` instead');
	}

	var directionProp = props.direction;
	if (directionProp || props.hasOwnProperty('vertical')) {
		var direction = directionProp ? directionProp : props.vertical ? 'DIRECTION_ALL' : 'DIRECTION_HORIZONTAL';
		hammer.get('pan').set({ direction: Hammer[direction] });
		hammer.get('swipe').set({ direction: Hammer[direction] });
	}

	if (props.options) {
		Object.keys(props.options).forEach(function (option) {
			if (option === 'recognizers') {
				Object.keys(props.options.recognizers).forEach(function (gesture) {
					var recognizer = hammer.get(gesture);
					recognizer.set(props.options.recognizers[gesture]);
					if (props.options.recognizers[gesture].requireFailure) {
						recognizer.requireFailure(props.options.recognizers[gesture].requireFailure);
					}
				}, _this);
			} else {
				var key = option;
				var optionObj = {};
				optionObj[key] = props.options[option];
				hammer.set(optionObj);
			}
		}, this);
	}

	if (props.recognizeWith) {
		Object.keys(props.recognizeWith).forEach(function (gesture) {
			var recognizer = hammer.get(gesture);
			recognizer.recognizeWith(props.recognizeWith[gesture]);
		}, this);
	}

	Object.keys(props).forEach(function (p) {
		var e = handlerToEvent[p];
		if (e) {
			hammer.off(e);
			hammer.on(e, props[p]);
		}
	});
}

var HammerComponent = function (_React$Component) {
	(0, _inherits3['default'])(HammerComponent, _React$Component);

	function HammerComponent() {
		(0, _classCallCheck3['default'])(this, HammerComponent);
		return (0, _possibleConstructorReturn3['default'])(this, (HammerComponent.__proto__ || Object.getPrototypeOf(HammerComponent)).apply(this, arguments));
	}

	(0, _createClass3['default'])(HammerComponent, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.hammer = new Hammer(_reactDom2['default'].findDOMNode(this));
			updateHammer(this.hammer, this.props);
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			if (this.hammer) {
				updateHammer(this.hammer, this.props);
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.hammer) {
				this.hammer.stop();
				this.hammer.destroy();
			}
			this.hammer = null;
		}
	}, {
		key: 'render',
		value: function render() {
			var props = {};

			Object.keys(this.props).forEach(function (i) {
				if (!privateProps[i]) {
					props[i] = this.props[i];
				}
			}, this);

			// Reuse the child provided
			// This makes it flexible to use whatever element is wanted (div, ul, etc)
			return _react2['default'].cloneElement(_react2['default'].Children.only(this.props.children), props);
		}
	}]);
	return HammerComponent;
}(_react2['default'].Component);

HammerComponent.displayName = 'Hammer';
HammerComponent.propTypes = {
	className: _propTypes2['default'].string
};
exports['default'] = HammerComponent;
module.exports = exports['default'];