export interface KnobControlConfig<T = never> {
    name: string;
    value: T;
    defaultValue?: T;
}
export interface KnobControlProps<T> {
    knob: KnobControlConfig<T>;
    onChange: (value: T) => T;
}
