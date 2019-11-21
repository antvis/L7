export declare type Breakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export declare type BreakpointMap = Partial<Record<Breakpoint, string>>;
export declare const responsiveArray: Breakpoint[];
export declare const responsiveMap: BreakpointMap;
declare type SubscribeFunc = (screens: BreakpointMap) => void;
declare const responsiveObserve: {
    dispatch(pointMap: Partial<Record<"lg" | "sm" | "xs" | "md" | "xl" | "xxl", string>>): boolean;
    subscribe(func: SubscribeFunc): string;
    unsubscribe(token: string): void;
    unregister(): void;
    register(): void;
};
export default responsiveObserve;
