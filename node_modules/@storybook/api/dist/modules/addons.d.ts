import { ReactElement } from 'react';
import { Module } from '../index';
import { Options } from '../store';
export declare enum types {
    TAB = "tab",
    PANEL = "panel",
    TOOL = "tool",
    PREVIEW = "preview",
    NOTES_ELEMENT = "notes-element"
}
export declare type Types = types | string;
export interface RenderOptions {
    active: boolean;
    key: string;
}
export interface RouteOptions {
    storyId: string;
}
export interface MatchOptions {
    viewMode: string;
}
export interface Addon {
    title: string;
    type?: Types;
    id?: string;
    route?: (routeOptions: RouteOptions) => string;
    match?: (matchOptions: MatchOptions) => boolean;
    render: (renderOptions: RenderOptions) => ReactElement<any>;
    paramKey?: string;
}
export interface Collection {
    [key: string]: Addon;
}
interface Panels {
    [id: string]: Addon;
}
declare type StateMerger<S> = (input: S) => S;
export interface SubAPI {
    getElements: (type: Types) => Collection;
    getPanels: () => Collection;
    getStoryPanels: () => Collection;
    getSelectedPanel: () => string;
    setSelectedPanel: (panelName: string) => void;
    setAddonState<S>(addonId: string, newStateOrMerger: S | StateMerger<S>, options?: Options): Promise<S>;
    getAddonState<S>(addonId: string): S;
}
export declare function ensurePanel(panels: Panels, selectedPanel?: string, currentPanel?: string): string;
declare const _default: ({ provider, store }: Module) => {
    api: SubAPI;
    state: {
        selectedPanel: string;
        addons: {};
    };
};
export default _default;
