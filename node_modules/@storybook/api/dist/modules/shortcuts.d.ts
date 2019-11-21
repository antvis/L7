import { Module, API } from '../index';
export declare const isMacLike: () => boolean;
export declare const controlOrMetaKey: () => "meta" | "control";
export declare function keys<O>(o: O): (keyof O)[];
export interface SubState {
    shortcuts: Shortcuts;
}
export interface SubAPI {
    getShortcutKeys(): Shortcuts;
    setShortcuts(shortcuts: Shortcuts): Promise<Shortcuts>;
    setShortcut(action: Action, value: KeyCollection): Promise<KeyCollection>;
    restoreAllDefaultShortcuts(): Promise<Shortcuts>;
    restoreDefaultShortcut(action: Action): Promise<KeyCollection>;
    handleKeydownEvent(api: API, event: Event): void;
    handleShortcutFeature(api: API, feature: Action): void;
}
export declare type KeyCollection = string[];
export interface Shortcuts {
    fullScreen: KeyCollection;
    togglePanel: KeyCollection;
    panelPosition: KeyCollection;
    toggleNav: KeyCollection;
    toolbar: KeyCollection;
    search: KeyCollection;
    focusNav: KeyCollection;
    focusIframe: KeyCollection;
    focusPanel: KeyCollection;
    prevComponent: KeyCollection;
    nextComponent: KeyCollection;
    prevStory: KeyCollection;
    nextStory: KeyCollection;
    shortcutsPage: KeyCollection;
    aboutPage: KeyCollection;
    escape: KeyCollection;
}
export declare type Action = keyof Shortcuts;
export declare const defaultShortcuts: Shortcuts;
export interface Event extends KeyboardEvent {
    target: {
        tagName: string;
        addEventListener(): void;
        removeEventListener(): boolean;
        dispatchEvent(event: Event): boolean;
        getAttribute(attr: string): string | null;
    };
}
export default function initShortcuts({ store }: Module): {
    api: SubAPI;
    state: SubState;
    init: ({ api: fullApi }: API) => void;
};
