function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* tslint:disable:interface-name */
import React from 'react';
import { Map } from 'immutable';
import ToolbarLine from './ToolbarLine';
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
        _this.pluginsMap = Map(map);
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
            if (React.isValidElement(component)) {
                return React.cloneElement(component, props);
            }
            return React.createElement(component, props);
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

        return React.createElement(
            'div',
            { className: prefixCls + '-toolbar' },
            toolbars.map(function (toolbar, idx) {
                var children = React.Children.map(toolbar, _this2.renderToolbarItem.bind(_this2));
                return React.createElement(
                    ToolbarLine,
                    { key: 'toolbar-' + idx },
                    children
                );
            })
        );
    };

    return Toolbar;
}(React.Component);

export default Toolbar;