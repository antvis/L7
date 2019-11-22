import React from 'react';
declare const _default: {
    component: React.FunctionComponent<import("./SidebarStories").StoriesProps>;
    title: string;
    decorators: ((s: any) => JSX.Element)[];
    excludeStories: RegExp;
};
export default _default;
export declare const withRootData: {
    stories: any;
    storyId: string;
};
export declare const withRoot: () => JSX.Element;
export declare const noRootData: {
    stories: any;
    storyId: string;
};
export declare const noRoot: () => JSX.Element;
export declare const emptyData: {
    stories: {};
};
export declare const empty: () => JSX.Element;
export declare const loading: () => JSX.Element;
