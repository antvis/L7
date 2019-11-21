import { ActionOptions, DecoratorFunction, HandlerFunction } from '../models';
export declare const decorateAction: (decorators: DecoratorFunction[]) => (name: string, options?: ActionOptions) => HandlerFunction;
export declare const decorate: (decorators: DecoratorFunction[]) => {
    action: (name: string, options?: ActionOptions) => HandlerFunction;
    actions: (...args: any[]) => any;
    withActions: (...args: any[]) => (storyFn: () => any) => any;
};
