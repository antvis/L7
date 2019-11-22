declare const _default: {
    component: ({ name, isComponent, isLeaf, isExpanded, isSelected, ...props }: any) => JSX.Element;
    title: string;
    decorators: ((storyFn: any) => JSX.Element)[];
};
export default _default;
export declare const group: () => JSX.Element;
export declare const component: () => JSX.Element;
export declare const componentExpanded: () => JSX.Element;
export declare const story: () => JSX.Element;
export declare const storySelected: () => JSX.Element;
export declare const longName: {
    (): JSX.Element;
    story: {
        name: string;
    };
};
export declare const nestedDepths: () => JSX.Element;
export declare const loading: () => JSX.Element;
