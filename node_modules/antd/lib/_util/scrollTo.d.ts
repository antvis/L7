interface ScrollToOptions {
    /** Scroll container, default as window */
    getContainer?: () => HTMLElement | Window;
    /** Scroll end callback */
    callback?: () => any;
    /** Animation duration, default as 450 */
    duration?: number;
}
export default function scrollTo(y: number, options?: ScrollToOptions): void;
export {};
