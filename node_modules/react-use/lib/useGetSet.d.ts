import { Dispatch } from 'react';
import { HookState, InitialHookState } from './util/resolveHookState';
export default function useGetSet<S>(initialState: InitialHookState<S>): [() => S, Dispatch<HookState<S>>];
