interface RafMap {
    [id: number]: number;
}
declare function wrapperRaf(callback: () => void, delayFrames?: number): number;
declare namespace wrapperRaf {
    var cancel: (pid?: number | undefined) => void;
    var ids: RafMap;
}
export default wrapperRaf;
