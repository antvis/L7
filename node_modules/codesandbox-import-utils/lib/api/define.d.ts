export interface IFiles {
    [key: string]: {
        content: string;
        isBinary: boolean;
    };
}
export declare function getParameters(parameters: {
    files: IFiles;
}): string;
