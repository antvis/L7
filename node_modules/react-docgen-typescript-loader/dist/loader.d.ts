import webpack from "webpack";
export interface TSFile {
    text?: string;
    version: number;
}
export default function loader(this: webpack.loader.LoaderContext, source: string): string | undefined;
