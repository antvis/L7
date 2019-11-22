declare const _default: {
    component: ({ menuHighlighted, menu, ...props }: import("./SidebarHeading").SidebarHeadingProps) => JSX.Element;
    title: string;
    decorators: ((storyFn: any) => JSX.Element)[];
    excludeStories: RegExp;
};
export default _default;
export declare const menuHighlighted: () => JSX.Element;
export declare const standardData: {
    menu: {
        title: string;
        onClick: import("@storybook/addon-actions").HandlerFunction;
        id: string;
    }[];
};
export declare const standard: () => JSX.Element;
export declare const standardNoLink: () => JSX.Element;
export declare const linkAndText: () => JSX.Element;
export declare const onlyText: () => JSX.Element;
export declare const longText: () => JSX.Element;
export declare const customBrandImage: () => JSX.Element;
