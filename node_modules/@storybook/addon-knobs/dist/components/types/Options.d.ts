import { FunctionComponent } from 'react';
import { KnobControlConfig, KnobControlProps } from './types';
export declare type OptionsTypeKnobSingleValue = string | number | null | undefined | string[] | number[] | (string | number)[];
export declare type OptionsTypeKnobValue<T extends OptionsTypeKnobSingleValue = OptionsTypeKnobSingleValue> = T | NonNullable<T>[] | readonly NonNullable<T>[];
export declare type OptionsKnobOptionsDisplay = 'radio' | 'inline-radio' | 'check' | 'inline-check' | 'select' | 'multi-select';
export interface OptionsKnobOptions {
    display: OptionsKnobOptionsDisplay;
}
export interface OptionsTypeKnob<T extends OptionsTypeKnobValue> extends KnobControlConfig<T> {
    options: OptionsTypeOptionsProp<T>;
    optionsObj: OptionsKnobOptions;
}
export interface OptionsTypeOptionsProp<T> {
    [key: string]: T;
}
export interface OptionsTypeProps<T extends OptionsTypeKnobValue> extends KnobControlProps<T> {
    knob: OptionsTypeKnob<T>;
    display: OptionsKnobOptionsDisplay;
}
declare const serialize: {
    <T>(value: T): T;
};
declare const deserialize: {
    <T>(value: T): T;
};
declare const OptionsType: FunctionComponent<OptionsTypeProps<any>> & {
    serialize: typeof serialize;
    deserialize: typeof deserialize;
};
export default OptionsType;
