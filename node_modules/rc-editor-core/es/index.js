import EditorCore from './EditorCore';
var GetText = EditorCore.GetText,
    GetHTML = EditorCore.GetHTML;

var toEditorState = EditorCore.ToEditorState;
var EditorCorePublic = {
    EditorCore: EditorCore,
    GetText: GetText,
    GetHTML: GetHTML,
    toEditorState: toEditorState
};
export { EditorCore, GetText, GetHTML, toEditorState };
export default EditorCorePublic;