import Source from './base-source';
import { registerBuiltins } from './builtins';
import { rasterDataTypes } from './parser/raster-tile';
export { registerBuiltins } from './builtins';
export {
  defaultRegistry,
  getParser,
  getTransform,
  ParserNotFoundError,
  ParserRegistry,
  registerParser,
  registerTransform,
  TransformNotFoundError,
} from './factory';
export * from './interface';
export * from './tile-source/index';
export * from './utils/relative-coordinates';
export { rasterDataTypes };

// 模块初始化副作用：注册全部 13 内置 parser + 6 内置 transform 到 defaultRegistry
// 单例（阶段 2.4：原顶层 19 行 registerParser/registerTransform 收敛到
// `registerBuiltins()`，便于显式调用 / 子集化 / 测试覆盖）。
//
// `package.json sideEffects: ["./es/index.js"]` 明示 bundler 仅本入口有 side
// effect —— 消费方经子路径 import（`@antv/l7-source/es/parser-registry` 等）
// 可 tree-shake 本调用，按需自行 `new ParserRegistry()` + 手工注册子集。
registerBuiltins();

export default Source;
