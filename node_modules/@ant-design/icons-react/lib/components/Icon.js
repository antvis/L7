'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

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

var React = _interopRequireWildcard(_react);

var _utils = require('../utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var twoToneColorPalette = {
    primaryColor: '#333',
    secondaryColor: '#E6E6E6'
};

var Icon = function (_React$Component) {
    (0, _inherits3['default'])(Icon, _React$Component);

    function Icon() {
        (0, _classCallCheck3['default'])(this, Icon);
        return (0, _possibleConstructorReturn3['default'])(this, (Icon.__proto__ || Object.getPrototypeOf(Icon)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Icon, [{
        key: 'render',
        value: function render() {
            var _extends2;

            var _props = this.props,
                type = _props.type,
                className = _props.className,
                onClick = _props.onClick,
                style = _props.style,
                primaryColor = _props.primaryColor,
                secondaryColor = _props.secondaryColor,
                rest = (0, _objectWithoutProperties3['default'])(_props, ['type', 'className', 'onClick', 'style', 'primaryColor', 'secondaryColor']);

            var target = void 0;
            var colors = twoToneColorPalette;
            if (primaryColor) {
                colors = {
                    primaryColor: primaryColor,
                    secondaryColor: secondaryColor || (0, _utils.getSecondaryColor)(primaryColor)
                };
            }
            if ((0, _utils.isIconDefinition)(type)) {
                target = type;
            } else if (typeof type === 'string') {
                target = Icon.get(type, colors);
                if (!target) {
                    // log(`Could not find icon: ${type}`);
                    return null;
                }
            }
            if (!target) {
                (0, _utils.log)('type should be string or icon definiton, but got ' + type);
                return null;
            }
            if (target && typeof target.icon === 'function') {
                target = (0, _extends4['default'])({}, target, {
                    icon: target.icon(colors.primaryColor, colors.secondaryColor)
                });
            }
            return (0, _utils.generate)(target.icon, 'svg-' + target.name, (0, _extends4['default'])((_extends2 = {
                className: className,
                onClick: onClick,
                style: style
            }, (0, _defineProperty3['default'])(_extends2, 'data-icon', target.name), (0, _defineProperty3['default'])(_extends2, 'width', '1em'), (0, _defineProperty3['default'])(_extends2, 'height', '1em'), (0, _defineProperty3['default'])(_extends2, 'fill', 'currentColor'), (0, _defineProperty3['default'])(_extends2, 'aria-hidden', 'true'), (0, _defineProperty3['default'])(_extends2, 'focusable', 'false'), _extends2), rest));
        }
    }], [{
        key: 'add',
        value: function add() {
            var _this2 = this;

            for (var _len = arguments.length, icons = Array(_len), _key = 0; _key < _len; _key++) {
                icons[_key] = arguments[_key];
            }

            icons.forEach(function (icon) {
                _this2.definitions.set((0, _utils.withSuffix)(icon.name, icon.theme), icon);
            });
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.definitions.clear();
        }
    }, {
        key: 'get',
        value: function get(key) {
            var colors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : twoToneColorPalette;

            if (key) {
                var target = this.definitions.get(key);
                if (target && typeof target.icon === 'function') {
                    target = (0, _extends4['default'])({}, target, {
                        icon: target.icon(colors.primaryColor, colors.secondaryColor)
                    });
                }
                return target;
            }
        }
    }, {
        key: 'setTwoToneColors',
        value: function setTwoToneColors(_ref) {
            var primaryColor = _ref.primaryColor,
                secondaryColor = _ref.secondaryColor;

            twoToneColorPalette.primaryColor = primaryColor;
            twoToneColorPalette.secondaryColor = secondaryColor || (0, _utils.getSecondaryColor)(primaryColor);
        }
    }, {
        key: 'getTwoToneColors',
        value: function getTwoToneColors() {
            return (0, _extends4['default'])({}, twoToneColorPalette);
        }
    }]);
    return Icon;
}(React.Component);

Icon.displayName = 'IconReact';
Icon.definitions = new _utils.MiniMap();
exports['default'] = Icon;
module.exports = exports['default'];