import Affix from '.';
export declare type BindElement = HTMLElement | Window | null | undefined;
export declare type Rect = ClientRect | DOMRect;
export declare function getTargetRect(target: BindElement): ClientRect;
export declare function getFixedTop(placeholderReact: Rect, targetRect: Rect, offsetTop: number | undefined): number | undefined;
export declare function getFixedBottom(placeholderReact: Rect, targetRect: Rect, offsetBottom: number | undefined): number | undefined;
interface ObserverEntity {
    target: HTMLElement | Window;
    affixList: Affix[];
    eventHandlers: {
        [eventName: string]: any;
    };
}
export declare function getObserverEntities(): ObserverEntity[];
export declare function addObserveTarget(target: HTMLElement | Window | null, affix: Affix): void;
export declare function removeObserveTarget(affix: Affix): void;
export {};
