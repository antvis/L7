'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _draftJs = require('draft-js');

var _immutable = require('immutable');

require('setimmediate');

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _Toolbar = require('../Toolbar');

var _ConfigStore = require('./ConfigStore');

var _ConfigStore2 = _interopRequireDefault(_ConfigStore);

var _getHTML = require('./export/getHTML');

var _getHTML2 = _interopRequireDefault(_getHTML);

var _exportText = require('./export/exportText');

var _exportText2 = _interopRequireDefault(_exportText);

var _customHTML2Content = require('./customHTML2Content');

var _customHTML2Content2 = _interopRequireDefault(_customHTML2Content);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* tslint:disable:member-ordering interface-name */


var hasCommandModifier = _draftJs.KeyBindingUtil.hasCommandModifier;

function noop() {}
;
var defaultPluginConfig = {};
var focusDummyStyle = {
    width: 0,
    opacity: 0,
    border: 0,
    position: 'absolute',
    left: 0,
    top: 0
};
var toolbar = (0, _Toolbar.createToolbar)();
var configStore = new _ConfigStore2['default']();

var EditorCore = function (_React$Component) {
    _inherits(EditorCore, _React$Component);

    function EditorCore(props) {
        _classCallCheck(this, EditorCore);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.cancelForceUpdateImmediate = function () {
            clearImmediate(_this.forceUpdateImmediate);
            _this.forceUpdateImmediate = null;
        };
        _this.handlePastedText = function (text, html) {
            var editorState = _this.state.editorState;

            if (html) {
                var contentState = editorState.getCurrentContent();
                var selection = editorState.getSelection();
                var fragment = (0, _customHTML2Content2['default'])(html, contentState);
                var pastedContent = _draftJs.Modifier.replaceWithFragment(contentState, selection, fragment);
                var newContent = pastedContent.merge({
                    selectionBefore: selection,
                    selectionAfter: pastedContent.getSelectionAfter().set('hasFocus', true)
                });
                _this.setEditorState(_draftJs.EditorState.push(editorState, newContent, 'insert-fragment'), true);
                return 'handled';
            }
            return 'not-handled';
        };
        _this.plugins = (0, _immutable.List)((0, _immutable.List)(props.plugins).flatten(true));
        var editorState = void 0;
        if (props.value !== undefined) {
            if (props.value instanceof _draftJs.EditorState) {
                editorState = props.value || _draftJs.EditorState.createEmpty();
            } else {
                editorState = _draftJs.EditorState.createEmpty();
            }
        } else {
            editorState = _draftJs.EditorState.createEmpty();
        }
        editorState = _this.generatorDefaultValue(editorState);
        _this.state = {
            plugins: _this.reloadPlugins(),
            editorState: editorState,
            customStyleMap: {},
            customBlockStyleMap: {},
            compositeDecorator: null
        };
        if (props.value !== undefined) {
            _this.controlledMode = true;
        }
        return _this;
    }

    EditorCore.ToEditorState = function ToEditorState(text) {
        var createEmptyContentState = _draftJs.ContentState.createFromText((0, _exportText.decodeContent)(text) || '');
        var editorState = _draftJs.EditorState.createWithContent(createEmptyContentState);
        return _draftJs.EditorState.forceSelection(editorState, createEmptyContentState.getSelectionAfter());
    };

    EditorCore.prototype.getDefaultValue = function getDefaultValue() {
        var _props = this.props,
            defaultValue = _props.defaultValue,
            value = _props.value;

        return value || defaultValue;
    };

    EditorCore.prototype.Reset = function Reset() {
        var defaultValue = this.getDefaultValue();
        var contentState = defaultValue ? defaultValue.getCurrentContent() : _draftJs.ContentState.createFromText('');
        var updatedEditorState = _draftJs.EditorState.push(this.state.editorState, contentState, 'remove-range');
        this.setEditorState(_draftJs.EditorState.forceSelection(updatedEditorState, contentState.getSelectionBefore()));
    };

    EditorCore.prototype.SetText = function SetText(text) {
        var createTextContentState = _draftJs.ContentState.createFromText(text || '');
        var editorState = _draftJs.EditorState.push(this.state.editorState, createTextContentState, 'change-block-data');
        this.setEditorState(_draftJs.EditorState.moveFocusToEnd(editorState), true);
    };

    EditorCore.prototype.getChildContext = function getChildContext() {
        return {
            getEditorState: this.getEditorState,
            setEditorState: this.setEditorState
        };
    };

    EditorCore.prototype.reloadPlugins = function reloadPlugins() {
        var _this2 = this;

        return this.plugins && this.plugins.size ? this.plugins.map(function (plugin) {
            // 如果插件有 callbacks 方法,则认为插件已经加载。
            if (plugin.callbacks) {
                return plugin;
            }
            // 如果插件有 constructor 方法,则构造插件
            if (plugin.hasOwnProperty('constructor')) {
                var pluginConfig = _extends(_this2.props.pluginConfig, plugin.config || {}, defaultPluginConfig);
                return plugin.constructor(pluginConfig);
            }
            // else 无效插件
            console.warn('>> 插件: [', plugin.name, '] 无效。插件或许已经过期。');
            return false;
        }).filter(function (plugin) {
            return plugin;
        }).toArray() : [];
    };

    EditorCore.prototype.componentWillMount = function componentWillMount() {
        var plugins = this.initPlugins().concat([toolbar]);
        var customStyleMap = {};
        var customBlockStyleMap = {};
        var customBlockRenderMap = (0, _immutable.Map)(_draftJs.DefaultDraftBlockRenderMap);
        var toHTMLList = (0, _immutable.List)([]);
        // initialize compositeDecorator
        var compositeDecorator = new _draftJs.CompositeDecorator(plugins.filter(function (plugin) {
            return plugin.decorators !== undefined;
        }).map(function (plugin) {
            return plugin.decorators;
        }).reduce(function (prev, curr) {
            return prev.concat(curr);
        }, []));
        // initialize Toolbar
        var toolbarPlugins = (0, _immutable.List)(plugins.filter(function (plugin) {
            return !!plugin.component && plugin.name !== 'toolbar';
        }));
        // load inline styles...
        plugins.forEach(function (plugin) {
            var styleMap = plugin.styleMap,
                blockStyleMap = plugin.blockStyleMap,
                blockRenderMap = plugin.blockRenderMap,
                toHtml = plugin.toHtml;

            if (styleMap) {
                for (var key in styleMap) {
                    if (styleMap.hasOwnProperty(key)) {
                        customStyleMap[key] = styleMap[key];
                    }
                }
            }
            if (blockStyleMap) {
                for (var _key in blockStyleMap) {
                    if (blockStyleMap.hasOwnProperty(_key)) {
                        customBlockStyleMap[_key] = blockStyleMap[_key];
                        customBlockRenderMap = customBlockRenderMap.set(_key, {
                            element: null
                        });
                    }
                }
            }
            if (toHtml) {
                toHTMLList = toHTMLList.push(toHtml);
            }
            if (blockRenderMap) {
                for (var _key2 in blockRenderMap) {
                    if (blockRenderMap.hasOwnProperty(_key2)) {
                        customBlockRenderMap = customBlockRenderMap.set(_key2, blockRenderMap[_key2]);
                    }
                }
            }
        });
        configStore.set('customStyleMap', customStyleMap);
        configStore.set('customBlockStyleMap', customBlockStyleMap);
        configStore.set('blockRenderMap', customBlockRenderMap);
        configStore.set('customStyleFn', this.customStyleFn.bind(this));
        configStore.set('toHTMLList', toHTMLList);
        this.setState({
            toolbarPlugins: toolbarPlugins,
            compositeDecorator: compositeDecorator
        });
        this.setEditorState(_draftJs.EditorState.set(this.state.editorState, { decorator: compositeDecorator }), false, false);
    };

    EditorCore.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (this.forceUpdateImmediate) {
            this.cancelForceUpdateImmediate();
        }
        if (this.controlledMode) {
            var decorators = nextProps.value.getDecorator();
            var editorState = decorators ? nextProps.value : _draftJs.EditorState.set(nextProps.value, { decorator: this.state.compositeDecorator });
            this.setState({
                editorState: editorState
            });
        }
    };

    EditorCore.prototype.componentWillUnmount = function componentWillUnmount() {
        this.cancelForceUpdateImmediate();
    };
    // 处理 value


    EditorCore.prototype.generatorDefaultValue = function generatorDefaultValue(editorState) {
        var defaultValue = this.getDefaultValue();
        if (defaultValue) {
            return defaultValue;
        }
        return editorState;
    };

    EditorCore.prototype.getStyleMap = function getStyleMap() {
        return configStore.get('customStyleMap');
    };

    EditorCore.prototype.setStyleMap = function setStyleMap(customStyleMap) {
        configStore.set('customStyleMap', customStyleMap);
        this.render();
    };

    EditorCore.prototype.initPlugins = function initPlugins() {
        var _this3 = this;

        var enableCallbacks = ['focus', 'getEditorState', 'setEditorState', 'getStyleMap', 'setStyleMap'];
        return this.getPlugins().map(function (plugin) {
            enableCallbacks.forEach(function (callbackName) {
                if (plugin.callbacks.hasOwnProperty(callbackName)) {
                    plugin.callbacks[callbackName] = _this3[callbackName].bind(_this3);
                }
            });
            return plugin;
        });
    };

    EditorCore.prototype.focusEditor = function focusEditor(ev) {
        this.refs.editor.focus(ev);
        if (this.props.readOnly) {
            this._focusDummy.focus();
        }
        if (this.props.onFocus) {
            this.props.onFocus(ev);
        }
    };

    EditorCore.prototype._focus = function _focus(ev) {
        if (!ev || !ev.nativeEvent || !ev.nativeEvent.target) {
            return;
        }
        if (document.activeElement && document.activeElement.getAttribute('contenteditable') === 'true') {
            return;
        }
        return this.focus(ev);
    };

    EditorCore.prototype.focus = function focus(ev) {
        var _this4 = this;

        var event = ev && ev.nativeEvent;
        if (event && event.target === this._editorWrapper) {
            var editorState = this.state.editorState;

            var selection = editorState.getSelection();
            if (!selection.getHasFocus()) {
                if (selection.isCollapsed()) {
                    return this.setState({
                        editorState: _draftJs.EditorState.moveSelectionToEnd(editorState)
                    }, function () {
                        _this4.focusEditor(ev);
                    });
                }
            }
        }
        this.focusEditor(ev);
    };

    EditorCore.prototype.getPlugins = function getPlugins() {
        return this.state.plugins.slice();
    };

    EditorCore.prototype.getEventHandler = function getEventHandler() {
        var _this5 = this;

        var enabledEvents = ['onUpArrow', 'onDownArrow', 'handleReturn', 'onFocus', 'onBlur', 'onTab', 'handlePastedText'];
        var eventHandler = {};
        enabledEvents.forEach(function (event) {
            eventHandler[event] = _this5.generatorEventHandler(event);
        });
        return eventHandler;
    };

    EditorCore.prototype.getEditorState = function getEditorState() {
        var needFocus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (needFocus) {
            this.refs.editor.focus();
        }
        return this.state.editorState;
    };

    EditorCore.prototype.setEditorState = function setEditorState(editorState) {
        var _this6 = this;

        var focusEditor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var triggerChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var newEditorState = editorState;
        this.getPlugins().forEach(function (plugin) {
            if (plugin.onChange) {
                var updatedEditorState = plugin.onChange(newEditorState);
                if (updatedEditorState) {
                    newEditorState = updatedEditorState;
                }
            }
        });
        if (this.props.onChange && triggerChange) {
            this.props.onChange(newEditorState);
            // close this issue https://github.com/ant-design/ant-design/issues/5788
            // when onChange not take any effect
            // `<Editor />` won't rerender cause no props is changed.
            // add an timeout here,
            // if props.onChange not trigger componentWillReceiveProps,
            // we will force render Editor with previous editorState,
            if (this.controlledMode) {
                this.forceUpdateImmediate = setImmediate(function () {
                    return _this6.setState({
                        editorState: new _draftJs.EditorState(_this6.state.editorState.getImmutable())
                    });
                });
            }
        }
        if (!this.controlledMode) {
            this.setState({ editorState: newEditorState }, focusEditor ? function () {
                return setImmediate(function () {
                    return _this6.refs.editor.focus();
                });
            } : noop);
        }
    };

    EditorCore.prototype.handleKeyBinding = function handleKeyBinding(ev) {
        if (this.props.onKeyDown) {
            ev.ctrlKey = hasCommandModifier(ev);
            var keyDownResult = this.props.onKeyDown(ev);
            if (keyDownResult) {
                return keyDownResult;
            }
            return (0, _draftJs.getDefaultKeyBinding)(ev);
        }
        return (0, _draftJs.getDefaultKeyBinding)(ev);
    };

    EditorCore.prototype.handleKeyCommand = function handleKeyCommand(command) {
        if (this.props.multiLines) {
            return this.eventHandle('handleKeyBinding', command);
        }
        return command === 'split-block' ? 'handled' : 'not-handled';
    };

    EditorCore.prototype.getBlockStyle = function getBlockStyle(contentBlock) {
        var customBlockStyleMap = configStore.get('customBlockStyleMap');
        var type = contentBlock.getType();
        if (customBlockStyleMap.hasOwnProperty(type)) {
            return customBlockStyleMap[type];
        }
        return '';
    };

    EditorCore.prototype.blockRendererFn = function blockRendererFn(contentBlock) {
        var blockRenderResult = null;
        this.getPlugins().forEach(function (plugin) {
            if (plugin.blockRendererFn) {
                var result = plugin.blockRendererFn(contentBlock);
                if (result) {
                    blockRenderResult = result;
                }
            }
        });
        return blockRenderResult;
    };

    EditorCore.prototype.eventHandle = function eventHandle(eventName) {
        var _props2;

        var plugins = this.getPlugins();

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key3 = 1; _key3 < _len; _key3++) {
            args[_key3 - 1] = arguments[_key3];
        }

        for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            if (plugin.callbacks[eventName] && typeof plugin.callbacks[eventName] === 'function') {
                var _plugin$callbacks;

                var result = (_plugin$callbacks = plugin.callbacks)[eventName].apply(_plugin$callbacks, args);
                if (result === true) {
                    return 'handled';
                }
            }
        }
        return this.props.hasOwnProperty(eventName) && (_props2 = this.props)[eventName].apply(_props2, args) === true ? 'handled' : 'not-handled';
    };

    EditorCore.prototype.generatorEventHandler = function generatorEventHandler(eventName) {
        var _this7 = this;

        return function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key4 = 0; _key4 < _len2; _key4++) {
                args[_key4] = arguments[_key4];
            }

            return _this7.eventHandle.apply(_this7, [eventName].concat(args));
        };
    };

    EditorCore.prototype.customStyleFn = function customStyleFn(styleSet) {
        if (styleSet.size === 0) {
            return {};
        }
        var plugins = this.getPlugins();
        var resultStyle = {};
        for (var i = 0; i < plugins.length; i++) {
            if (plugins[i].customStyleFn) {
                var styled = plugins[i].customStyleFn(styleSet);
                if (styled) {
                    _extends(resultStyle, styled);
                }
            }
        }
        return resultStyle;
    };

    EditorCore.prototype.render = function render() {
        var _classnames,
            _this8 = this;

        var _props3 = this.props,
            prefixCls = _props3.prefixCls,
            toolbars = _props3.toolbars,
            style = _props3.style,
            readOnly = _props3.readOnly,
            multiLines = _props3.multiLines;
        var _state = this.state,
            editorState = _state.editorState,
            toolbarPlugins = _state.toolbarPlugins;

        var customStyleMap = configStore.get('customStyleMap');
        var blockRenderMap = configStore.get('blockRenderMap');
        var eventHandler = this.getEventHandler();
        var Toolbar = toolbar.component;
        var cls = (0, _classnames3['default'])((_classnames = {}, _classnames[prefixCls + '-editor'] = true, _classnames.readonly = readOnly, _classnames.oneline = !multiLines, _classnames));
        return _react2['default'].createElement(
            'div',
            { style: style, className: cls, onClick: this._focus.bind(this) },
            _react2['default'].createElement(Toolbar, { editorState: editorState, prefixCls: prefixCls, className: prefixCls + '-toolbar', plugins: toolbarPlugins, toolbars: toolbars }),
            _react2['default'].createElement(
                'div',
                { className: prefixCls + '-editor-wrapper', ref: function ref(ele) {
                        return _this8._editorWrapper = ele;
                    }, style: style, onClick: function onClick(ev) {
                        return ev.preventDefault();
                    } },
                _react2['default'].createElement(_draftJs.Editor, _extends({}, this.props, eventHandler, { ref: 'editor', customStyleMap: customStyleMap, customStyleFn: this.customStyleFn.bind(this), editorState: editorState, handleKeyCommand: this.handleKeyCommand.bind(this), keyBindingFn: this.handleKeyBinding.bind(this), onChange: this.setEditorState.bind(this), blockStyleFn: this.getBlockStyle.bind(this), blockRenderMap: blockRenderMap, handlePastedText: this.handlePastedText, blockRendererFn: this.blockRendererFn.bind(this) })),
                readOnly ? _react2['default'].createElement('input', { style: focusDummyStyle, ref: function ref(ele) {
                        return _this8._focusDummy = ele;
                    }, onBlur: eventHandler.onBlur }) : null,
                this.props.children
            )
        );
    };

    return EditorCore;
}(_react2['default'].Component);

EditorCore.GetText = _exportText2['default'];
EditorCore.GetHTML = (0, _getHTML2['default'])(configStore);
EditorCore.defaultProps = {
    multiLines: true,
    plugins: [],
    prefixCls: 'rc-editor-core',
    pluginConfig: {},
    toolbars: [],
    spilitLine: 'enter'
};
EditorCore.childContextTypes = {
    getEditorState: _propTypes2['default'].func,
    setEditorState: _propTypes2['default'].func
};
exports['default'] = EditorCore;
module.exports = exports['default'];