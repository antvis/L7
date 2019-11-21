import Toolbar from './Toolbar';
export declare function createToolbar(config?: {}): {
    name: string;
    decorators: never[];
    callbacks: {
        onChange: (editorState: any) => void;
        onUpArrow: (_: any) => any;
        onDownArrow: (_: any) => any;
        getEditorState: (_: any) => any;
        setEditorState: (_: any) => any;
        handleReturn: (_: any) => any;
    };
    onChange(editorState: any): any;
    component: typeof Toolbar;
};
