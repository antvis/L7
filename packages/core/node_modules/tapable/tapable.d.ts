type FixedSizeArray<T extends number, U> = T extends 0
	? void[]
	: ReadonlyArray<U> & {
			0: U;
			length: T;
	  };
type Measure<T extends number> = T extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
	? T
	: never;
type Append<T extends any[], U> = {
	0: [U];
	1: [T[0], U];
	2: [T[0], T[1], U];
	3: [T[0], T[1], T[2], U];
	4: [T[0], T[1], T[2], T[3], U];
	5: [T[0], T[1], T[2], T[3], T[4], U];
	6: [T[0], T[1], T[2], T[3], T[4], T[5], U];
	7: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], U];
	8: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], U];
}[Measure<T["length"]>];
type AsArray<T> = T extends any[] ? T : [T];

type Callback<E, T> = (error?: E, result?: T) => void;

type Tap = TapOptions & {
	name: string;
};

type TapOptions = {
	before?: string;
	stage?: number;
};

interface HookInterceptor<H> {
	name?: string;
	tap?: (tap: Tap) => void;
	call?: (...args: any[]) => void;
	loop?: (...args: any[]) => void;
	register?: (hook: H) => H;
}

type ArgumentNames<T extends any[]> = FixedSizeArray<T["length"], string>;

declare class Hook<T, R> {
	constructor(args?: ArgumentNames<AsArray<T>>, name?: string);
	name: string | undefined;
	intercept(interceptor: HookInterceptor<Hook<T, R>>): void;
	isUsed(): boolean;
	callAsync(...args: Append<AsArray<T>, Callback<Error, R>>): void;
	promise(...args: AsArray<T>): Promise<R>;
	tap(options: string | Tap, fn: (...args: AsArray<T>) => R): void;
	withOptions(options: TapOptions): Hook<T, R>;
}

export class SyncHook<T, R = void> extends Hook<T, R> {
	call(...args: AsArray<T>): R;
}

export class SyncBailHook<T, R> extends SyncHook<T, R> {}
export class SyncLoopHook<T> extends SyncHook<T, void> {}
export class SyncWaterfallHook<T> extends SyncHook<T, AsArray<T>[0]> {}

declare class AsyncHook<T, R> extends Hook<T, R> {
	tapAsync(
		options: string | Tap,
		fn: (...args: Append<AsArray<T>, Callback<Error, R>>) => void
	): void;
	tapPromise(
		options: string | Tap,
		fn: (...args: AsArray<T>) => Promise<R>
	): void;
}

export class AsyncParallelHook<T> extends AsyncHook<T, void> {}
export class AsyncParallelBailHook<T, R> extends AsyncHook<T, R> {}
export class AsyncSeriesHook<T> extends AsyncHook<T, void> {}
export class AsyncSeriesBailHook<T, R> extends AsyncHook<T, R> {}
export class AsyncSeriesLoopHook<T> extends AsyncHook<T, void> {}
export class AsyncSeriesWaterfallHook<T> extends AsyncHook<T, AsArray<T>[0]> {}

type HookFactory<H> = (key: any, hook?: H) => H;

interface HookMapInterceptor<H> {
	factory?: HookFactory<H>;
}

export class HookMap<H> {
	constructor(factory: HookFactory<H>, name?: string);
	name: string | undefined;
	get(key: any): H | undefined;
	for(key: any): H;
	intercept(interceptor: HookMapInterceptor<H>): void;
}

export class MultiHook<H> {
	constructor(hooks: H[], name?: string);
	name: string | undefined;
	tap(options: string | Tap, fn?: Function): void;
	tapAsync(options: string | Tap, fn?: Function): void;
	tapPromise(options: string | Tap, fn?: Function): void;
}
