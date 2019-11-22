import { FunctionComponent } from 'react';
import { KnobControlConfig, KnobControlProps } from './types';
declare type DateTypeKnobValue = string[];
export interface FileTypeKnob extends KnobControlConfig<DateTypeKnobValue> {
    accept: string;
}
export interface FilesTypeProps extends KnobControlProps<DateTypeKnobValue> {
    knob: FileTypeKnob;
}
declare const serialize: () => undefined;
declare const deserialize: () => undefined;
declare const FilesType: FunctionComponent<FilesTypeProps> & {
    serialize: typeof serialize;
    deserialize: typeof deserialize;
};
export default FilesType;
