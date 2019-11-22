declare namespace RcEditorCore {
  interface EditorCore {
    props:any;
    state:any;
    refs:any;
    context:any;
    setState():any;
    render():any;
    forceUpdate():any;
  }
  interface IEditor {
    new():EditorCore;
  }
  var EditorCore: IEditor;
}

export = RcEditorCore;
