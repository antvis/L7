import * as React from 'react';
import * as codemirror from 'codemirror';
export interface IDefineModeOptions {
    fn: () => codemirror.Mode<any>;
    name: string;
}
export interface ISetScrollOptions {
    x?: number | null;
    y?: number | null;
}
export interface ISetSelectionOptions {
    anchor: codemirror.Position;
    head: codemirror.Position;
}
export interface DomEvent {
    (editor: codemirror.Editor, event: Event): void;
}
export interface ICodeMirror {
    autoCursor?: boolean;
    autoScroll?: boolean;
    className?: string;
    cursor?: codemirror.Position;
    defineMode?: IDefineModeOptions;
    editorDidConfigure?: (editor: codemirror.Editor) => void;
    editorDidMount?: (editor: codemirror.Editor, value: string, cb: () => void) => void;
    editorWillUnmount?: (lib: any) => void;
    onBlur?: DomEvent;
    onChange?: (editor: codemirror.Editor, data: codemirror.EditorChange, value: string) => void;
    onContextMenu?: DomEvent;
    onCopy?: DomEvent;
    onCursor?: (editor: codemirror.Editor, data: codemirror.Position) => void;
    onCut?: DomEvent;
    onCursorActivity?: (editor: codemirror.Editor) => void;
    onDblClick?: DomEvent;
    onDragEnter?: DomEvent;
    onDragLeave?: DomEvent;
    onDragOver?: DomEvent;
    onDragStart?: DomEvent;
    onDrop?: DomEvent;
    onFocus?: DomEvent;
    onGutterClick?: (editor: codemirror.Editor, lineNumber: number, gutter: string, event: Event) => void;
    onKeyDown?: DomEvent;
    onKeyPress?: DomEvent;
    onKeyUp?: DomEvent;
    onMouseDown?: DomEvent;
    onPaste?: DomEvent;
    onRenderLine?: (editor: codemirror.Editor, line: codemirror.LineHandle, element: HTMLElement) => void;
    onScroll?: (editor: codemirror.Editor, data: codemirror.ScrollInfo) => void;
    onSelection?: (editor: codemirror.Editor, data: any) => void;
    onTouchStart?: DomEvent;
    onUpdate?: (editor: codemirror.Editor) => void;
    onViewportChange?: (editor: codemirror.Editor, start: number, end: number) => void;
    options?: codemirror.EditorConfiguration;
    selection?: {
        ranges: Array<ISetSelectionOptions>;
        focus?: boolean;
    };
    scroll?: ISetScrollOptions;
}
export interface IControlledCodeMirror extends ICodeMirror {
    onBeforeChange: (editor: codemirror.Editor, data: codemirror.EditorChange, value: string) => void;
    value: string;
}
export interface IUnControlledCodeMirror extends ICodeMirror {
    detach?: boolean;
    editorDidAttach?: (editor: codemirror.Editor) => void;
    editorDidDetach?: (editor: codemirror.Editor) => void;
    onBeforeChange?: (editor: codemirror.Editor, data: codemirror.EditorChange, value: string, next: () => void) => void;
    value?: string;
}
export declare class Controlled extends React.Component<IControlledCodeMirror, any> {
}
export declare class UnControlled extends React.Component<IUnControlledCodeMirror, any> {
}
