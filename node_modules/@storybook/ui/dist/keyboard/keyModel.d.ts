import { KeyCode } from './keyCodes';
export interface KeyBoardEvent {
    readonly ctrlKey: boolean;
    readonly shiftKey: boolean;
    readonly altKey: boolean;
    readonly metaKey: boolean;
    readonly keyCodeKey: KeyCode;
    readonly code: string;
    readonly key: string;
}
