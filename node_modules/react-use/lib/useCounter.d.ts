import { HookState, InitialHookState } from './util/resolveHookState';
export interface CounterActions {
    inc: (delta?: number) => void;
    dec: (delta?: number) => void;
    get: () => number;
    set: (value: HookState<number>) => void;
    reset: (value?: HookState<number>) => void;
}
export default function useCounter(initialValue?: InitialHookState<number>, max?: number | null, min?: number | null): [number, CounterActions];
