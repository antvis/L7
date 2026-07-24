import type { ILayerPlugin } from '@antv/l7-core';
import DataMappingPlugin from './DataMappingPlugin';
import DataSourcePlugin from './DataSourcePlugin';
import FeatureScalePlugin from './FeatureScalePlugin';
import LayerAnimateStylePlugin from './LayerAnimateStylePlugin';
import LayerMaskPlugin from './LayerMaskPlugin';
import LayerModelPlugin from './LayerModelPlugin';
import LayerStylePlugin from './LayerStylePlugin';
import LightingPlugin from './LightingPlugin';
import MultiPassRendererPlugin from './MultiPassRendererPlugin';
import PixelPickingPlugin from './PixelPickingPlugin';
import RegisterStyleAttributePlugin from './RegisterStyleAttributePlugin';
import ShaderUniformPlugin from './ShaderUniformPlugin';
import UpdateModelPlugin from './UpdateModelPlugin';
import UpdateStyleAttributePlugin from './UpdateStyleAttributePlugin';

/**
 * 图层插件注册表（阶段 2.1）。
 *
 * 取代 `init()` 内联的 `createPlugins()` 调用，作为图层默认插件集的可配置来源。
 *
 * 与 source `ParserRegistry`（无状态单例）不同：内置插件是**有状态实例**
 * （`DataSourcePlugin.mapService` 在 `apply` 时赋值、`FeatureScalePlugin.scaleOptions`
 * 缓存数据），**不可跨图层共享单例**。故 `defaultRegistry` 不适用——每个
 * `BaseLayer` 实例持独立 `LayerPluginRegistry`，`registerBuiltinDefaults()` 在
 * init 时幂等注册一组全新实例。
 *
 * 接入点（外部追加/替换/排序，PLAN 2.1 意图）：
 * ```
 * const layer = new PointLayer();
 * layer.pluginRegistry.registerBuiltinDefaults(); // 显式注册默认 14
 * layer.pluginRegistry.register(new MyPlugin());   // 追加
 * layer.pluginRegistry.reorder((a, b) => ...);     // 重排
 * layer.init(); // registerBuiltinDefaults 幂等跳过，使用上面配置
 * ```
 *
 * `replace(name, plugin)` / `sortByOrder()` / `getByName(name)` 基于 2.2 引入的
 * `ILayerPlugin` 元数据（`name?`/`order?`/`initStage?`）提供按名精确替换、
 * 声明式稳定排序与按名查询。当前 2.2 仅暴露 API，不改 `BaseLayer.init` 内的
 * apply 时序（14 内置插件均未声明 `order`/`initStage`，`sortByOrder()` 为 no-op）。
 *
 * 与 `addPlugin` 关系：`BaseLayer.addPlugin` 是 init 后追加到 `this.plugins`
 * 的低频 API，**不**同步本 registry（历史行为保留）；registry 是 init 前配置
 * 默认集/排序的平行 API。两者解耦，互不干扰。
 *
 * 旧全局 `createPlugins()` 保留为 deprecation wrapper（见 `./index.ts`），
 * 外部调用方完全等价。
 *
 * 重构参考：docs/refactoring/layers/PLAN.md › 阶段 2.1 / 2.2
 */
export class LayerPluginRegistry {
  private plugins: ILayerPlugin[] = [];
  private defaultsRegistered = false;

  /**
   * 注册内置默认插件集（14 个，每次调用 `new` 全新实例）。
   *
   * 幂等：若已注册过默认集则跳过，保留外部已做的 `register` / `reorder`。
   * 这样用户可在 `init` 前显式调用本方法 + `register` / `reorder` 自定义，
   * `init` 内的再次调用不会覆盖。
   *
   * 顺序与原 `createPlugins()` 字节级一致（插件 `apply` 顺序敏感，不可乱序）。
   */
  public registerBuiltinDefaults(): this {
    if (this.defaultsRegistered) {
      return this;
    }
    this.defaultsRegistered = true;
    this.plugins = [
      new DataSourcePlugin(),
      new RegisterStyleAttributePlugin(),
      new FeatureScalePlugin(),
      new DataMappingPlugin(),
      new LayerStylePlugin(),
      new LayerMaskPlugin(),
      new UpdateStyleAttributePlugin(),
      new UpdateModelPlugin(),
      new MultiPassRendererPlugin(),
      new ShaderUniformPlugin(),
      new LayerAnimateStylePlugin(),
      new LightingPlugin(),
      new PixelPickingPlugin(),
      new LayerModelPlugin(),
    ];
    return this;
  }

  /**
   * 追加自定义插件（末尾）。
   */
  public register(plugin: ILayerPlugin): this {
    this.plugins.push(plugin);
    return this;
  }

  /**
   * 按比较函数重排当前插件集（稳定排序）。
   *
   * 用于调整 `apply` 顺序。注意：`apply` 在 `BaseLayer.init` 内顺序执行，
   * 错误重排可能影响插件间依赖（如 `LayerModelPlugin` 依赖 scale/data 就绪）。
   */
  public reorder(compareFn: (a: ILayerPlugin, b: ILayerPlugin) => number): this {
    this.plugins.sort(compareFn);
    return this;
  }

  /**
   * 按 `name` 精确替换已注册插件（阶段 2.2）。
   *
   * 仅替换第一个 `name` 匹配项；未匹配则抛错（显式 fail，避免静默吞掉拼写
   * 错误）。返回 this 以便链式：
   * `registry.registerBuiltinDefaults().replace('data-source', new MyDS())`。
   *
   * 替换发生在 `getAll()` 前的任意时点；若在 `registerBuiltinDefaults()` 前
   * 该 name 不存在则抛错——先注册默认集再替换。替换保留被替换项的数组下标
   * （apply 序位不变），便于在不打乱顺序的前提下替换实现。
   */
  public replace(name: string, plugin: ILayerPlugin): this {
    const idx = this.plugins.findIndex((p) => p.name === name);
    if (idx === -1) {
      throw new Error(`LayerPluginRegistry.replace: no plugin named "${name}" is registered`);
    }
    this.plugins[idx] = plugin;
    return this;
  }

  /**
   * 按 `order` 升序稳定排序（阶段 2.2）。
   *
   * 缺省 `order`（undefined）视 `Infinity` 兜底，排在所有显式 order 之后；
   * 相同 order（含均为 undefined）保持插入序（现代引擎 `Array.prototype.sort`
   * 稳定）。当前 14 内置插件均未声明 `order`，故调用本方法为 no-op——
   * 仅服务于显式声明 `order` 的自定义插件集。
   */
  public sortByOrder(): this {
    this.plugins.sort((a, b) => {
      const ao = a.order ?? Infinity;
      const bo = b.order ?? Infinity;
      if (ao === bo) {
        return 0;
      }
      return ao - bo;
    });
    return this;
  }

  /**
   * 按 `name` 取插件（未匹配返回 undefined，阶段 2.2）。
   */
  public getByName(name: string): ILayerPlugin | undefined {
    return this.plugins.find((p) => p.name === name);
  }

  /**
   * 取当前插件集（浅拷贝，保持插入序）。
   *
   * `BaseLayer.init` 用本方法填充 `this.plugins`。返回浅拷贝避免外部 mutate
   * 内部数组。
   */
  public getAll(): ILayerPlugin[] {
    return [...this.plugins];
  }

  /**
   * 清空注册表（含默认集 flag）。
   *
   * 用于完全自定义插件集场景：`clear()` 后手工 `register` 子集，`init`
   * 时 `registerBuiltinDefaults` 会重新填默认——若要彻底禁默认集，`init`
   * 前需 `registerBuiltinDefaults()` 再 `clear()` 仅清实例保留 flag，
   * 或本 2.1 不支持"无默认集"（留 2.2）。
   */
  public clear(): this {
    this.plugins = [];
    this.defaultsRegistered = false;
    return this;
  }

  /** 默认集是否已注册（调试/断言用）。 */
  public isDefaultsRegistered(): boolean {
    return this.defaultsRegistered;
  }
}
