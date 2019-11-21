import { EditorState } from 'draft-js';
export interface Plugin {
    name: string;
    decorators?: Array<any>;
    component?: Function;
    onChange: (editorState: EditorState) => EditorState;
    customStyleFn?: Function;
    callbacks: {
        onUpArrow?: Function;
        onDownArrow?: Function;
        handleReturn?: Function;
        handleKeyBinding?: Function;
        setEditorState: (editorState: EditorState) => void;
        getEditorState: () => EditorState;
    };
    config?: Object;
}
