import { MentionsProps } from './Mentions';
import { OptionProps } from './Option';
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
declare type OmitFunc = <T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K) => {
    [K2 in Exclude<keyof T, K[number]>]: T[K2];
};
export declare const omit: OmitFunc;
/**
 * Cut input selection into 2 part and return text before selection start
 */
export declare function getBeforeSelectionText(input: HTMLTextAreaElement): string;
interface MeasureIndex {
    location: number;
    prefix: string;
}
/**
 * Find the last match prefix index
 */
export declare function getLastMeasureIndex(text: string, prefix?: string | string[]): MeasureIndex;
interface MeasureConfig {
    measureLocation: number;
    prefix: string;
    targetText: string;
    selectionStart: number;
    split: string;
}
/**
 * Paint targetText into current text:
 *  text: little@litest
 *  targetText: light
 *  => little @light test
 */
export declare function replaceWithMeasure(text: string, measureConfig: MeasureConfig): {
    text: string;
    selectionLocation: number;
};
export declare function setInputSelection(input: HTMLTextAreaElement, location: number): void;
export declare function validateSearch(text: string, props: MentionsProps): boolean;
export declare function filterOption(input: string, { value }: OptionProps): boolean;
export {};
