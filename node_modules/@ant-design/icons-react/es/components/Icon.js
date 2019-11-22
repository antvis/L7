import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import * as React from 'react';
import { generate, getSecondaryColor, isIconDefinition, log, MiniMap, withSuffix } from '../utils';
var twoToneColorPalette = {
    primaryColor: '#333',
    secondaryColor: '#E6E6E6'
};

var Icon = function (_React$Component) {
    _inherits(Icon, _React$Component);

    function Icon() {
        _classCallCheck(this, Icon);

        return _possibleConstructorReturn(this, (Icon.__proto__ || Object.getPrototypeOf(Icon)).apply(this, arguments));
    }

    _createClass(Icon, [{
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
                rest = _objectWithoutProperties(_props, ['type', 'className', 'onClick', 'style', 'primaryColor', 'secondaryColor']);

            var target = void 0;
            var colors = twoToneColorPalette;
            if (primaryColor) {
                colors = {
                    primaryColor: primaryColor,
                    secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
                };
            }
            if (isIconDefinition(type)) {
                target = type;
            } else if (typeof type === 'string') {
                target = Icon.get(type, colors);
                if (!target) {
                    // log(`Could not find icon: ${type}`);
                    return null;
                }
            }
            if (!target) {
                log('type should be string or icon definiton, but got ' + type);
                return null;
            }
            if (target && typeof target.icon === 'function') {
                target = _extends({}, target, {
                    icon: target.icon(colors.primaryColor, colors.secondaryColor)
                });
            }
            return generate(target.icon, 'svg-' + target.name, _extends((_extends2 = {
                className: className,
                onClick: onClick,
                style: style
            }, _defineProperty(_extends2, 'data-icon', target.name), _defineProperty(_extends2, 'width', '1em'), _defineProperty(_extends2, 'height', '1em'), _defineProperty(_extends2, 'fill', 'currentColor'), _defineProperty(_extends2, 'aria-hidden', 'true'), _defineProperty(_extends2, 'focusable', 'false'), _extends2), rest));
        }
    }], [{
        key: 'add',
        value: function add() {
            var _this2 = this;

            for (var _len = arguments.length, icons = Array(_len), _key = 0; _key < _len; _key++) {
                icons[_key] = arguments[_key];
            }

            icons.forEach(function (icon) {
                _this2.definitions.set(withSuffix(icon.name, icon.theme), icon);
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
                    target = _extends({}, target, {
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
            twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
        }
    }, {
        key: 'getTwoToneColors',
        value: function getTwoToneColors() {
            return _extends({}, twoToneColorPalette);
        }
    }]);

    return Icon;
}(React.Component);

Icon.displayName = 'IconReact';
Icon.definitions = new MiniMap();
export default Icon;