import { PathPlugin } from './paths-plugin';
import { CheckerPlugin as _CheckerPlugin } from './watch-mode';
declare function loader(text: any): void;
declare namespace loader {
    const TsConfigPathsPlugin: typeof PathPlugin;
    const CheckerPlugin: typeof _CheckerPlugin;
}
export = loader;
