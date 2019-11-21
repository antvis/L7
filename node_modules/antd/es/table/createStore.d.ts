export interface Store {
    setState: (partial: object) => void;
    getState: () => any;
    subscribe: (listener: () => void) => () => void;
}
export default function createStore(initialState: object): Store;
