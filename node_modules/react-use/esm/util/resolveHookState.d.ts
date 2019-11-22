export declare type StateSetter<S> = (prevState: S) => S;
export declare type InitialStateSetter<S> = () => S;
export declare type InitialHookState<S> = S | InitialStateSetter<S>;
export declare type HookState<S> = S | StateSetter<S>;
export declare type ResolvableHookState<S> = S | StateSetter<S> | InitialStateSetter<S>;
export declare function resolveHookState<S, C extends S>(newState: InitialStateSetter<S>): S;
export declare function resolveHookState<S, C extends S>(newState: StateSetter<S>, currentState: C): S;
export declare function resolveHookState<S, C extends S>(newState: ResolvableHookState<S>, currentState?: C): S;
