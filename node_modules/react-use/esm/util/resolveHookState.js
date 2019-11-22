export function resolveHookState(newState, currentState) {
    if (typeof newState === 'function') {
        return newState(currentState);
    }
    return newState;
}
