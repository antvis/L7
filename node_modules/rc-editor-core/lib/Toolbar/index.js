'use strict';

exports.__esModule = true;
exports.createToolbar = createToolbar;

var _Toolbar = require('./Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop(_) {}
;
function createToolbar() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    function editorStateChange(editorState) {
        // console.log('>> editorStateChange', editorState);
    }
    var callbacks = {
        onChange: editorStateChange,
        onUpArrow: noop,
        onDownArrow: noop,
        getEditorState: noop,
        setEditorState: noop,
        handleReturn: noop
    };
    return {
        name: 'toolbar',
        decorators: [],
        callbacks: callbacks,
        onChange: function onChange(editorState) {
            return callbacks.onChange ? callbacks.onChange(editorState) : editorState;
        },

        component: _Toolbar2['default']
    };
}