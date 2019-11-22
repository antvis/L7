import EditorCore from './EditorCore';
declare const toEditorState: typeof EditorCore.ToEditorState;
declare const EditorCorePublic: {
    EditorCore: typeof EditorCore;
    GetText: (editorState: any, options?: {
        encode: boolean;
    }) => string;
    GetHTML: (editorState: any) => any;
    toEditorState: (text: string) => any;
};
export { EditorCore, GetText, GetHTML, toEditorState };
export default EditorCorePublic;
