'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _ToolbarLine = require('./ToolbarLine');

var _ToolbarLine2 = _interopRequireDefault(_ToolbarLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* tslint:disable:interface-name */


function noop() {}

var Toolbar = function (_React$Component) {
    _inherits(Toolbar, _React$Component);

    function Toolbar(props) {
        _classCallCheck(this, Toolbar);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        var map = {};
        props.plugins.forEach(function (plugin) {
            map[plugin.name] = plugin;
        });
        _this.pluginsMap = (0, _immutable.Map)(map);
        _this.state = {
            editorState: props.editorState,
            toolbars: []
        };
        return _this;
    }

    Toolbar.prototype.renderToolbarItem = function renderToolbarItem(pluginName, idx) {
        var element = this.pluginsMap.get(pluginName);
        if (element && element.component) {
            var component = element.component;

            var props = {
                key: 'toolbar-item-' + idx,
                onClick: component.props ? component.props.onClick : noop
            };
            if (_react2['default'].isValidElement(component)) {
                return _react2['default'].cloneElement(component, props);
            }
            return _react2['default'].createElement(component, props);
        }
        return null;
    };

    Toolbar.prototype.conpomentWillReceiveProps = function conpomentWillReceiveProps(nextProps) {
        this.render();
    };

    Toolbar.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            toolbars = _props.toolbars,
            prefixCls = _props.prefixCls;

        return _react2['default'].createElement(
            'div',
            { className: prefixCls + '-toolbar' },
            toolbars.map(function (toolbar, idx) {
                var children = _react2['default'].Children.map(toolbar, _this2.renderToolbarItem.bind(_this2));
                return _react2['default'].createElement(
                    _ToolbarLine2['default'],
                    { key: 'toolbar-' + idx },
                    children
                );
            })
        );
    };

    return Toolbar;
}(_react2['default'].Component);

exports['default'] = Toolbar;
module.exports = exports['default'];