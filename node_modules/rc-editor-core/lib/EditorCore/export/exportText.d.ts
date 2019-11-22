import { EditorState } from "draft-js";
export declare function encodeContent(text: string): string;
export declare function decodeContent(text: string): string;
export default function exportText(editorState: EditorState, options?: {
    encode: boolean;
}): string;
