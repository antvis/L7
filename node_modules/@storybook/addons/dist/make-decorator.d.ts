import { StoryWrapper } from './types';
declare type MakeDecoratorResult = (...args: any) => any;
interface MakeDecoratorOptions {
    name: string;
    parameterName: string;
    allowDeprecatedUsage?: boolean;
    skipIfNoParametersOrOptions?: boolean;
    wrapper: StoryWrapper;
}
export declare const makeDecorator: ({ name, parameterName, wrapper, skipIfNoParametersOrOptions, allowDeprecatedUsage, }: MakeDecoratorOptions) => MakeDecoratorResult;
export {};
