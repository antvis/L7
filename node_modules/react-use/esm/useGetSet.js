import { useMemo, useRef } from 'react';
import useUpdate from './useUpdate';
import { resolveHookState } from './util/resolveHookState';
export default function useGetSet(initialState) {
    var state = useRef(resolveHookState(initialState));
    var update = useUpdate();
    return useMemo(function () { return [
        // get
        function () { return state.current; },
        // set
        function (newState) {
            state.current = resolveHookState(newState, state.current);
            update();
        },
    ]; }, []);
}
