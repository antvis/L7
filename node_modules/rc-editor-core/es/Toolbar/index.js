import Toolbar from './Toolbar';
function noop(_) {}
;
export function createToolbar() {
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

        component: Toolbar
    };
}