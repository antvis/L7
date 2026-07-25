import type { IGlobalConfigService, ILayerConfig } from '@antv/l7-core';
import type BaseLayer from './BaseLayer';

/**
 * 配置三轨收敛 delegate（阶段 3.1）。
 *
 * 收口 BaseLayer 中「配置三轨」状态与单一读/写路径：
 *
 *   rawConfig —— 构造入参快照（ctor 传入，选择性同步：仅更新已存在的键）
 *   needUpdateConfig —— init 前的 diff 缓冲（lazy 初始化为 undefined，
 *                       init 后写穿即清空）
 *   configService 读回 —— `read()` 经 `globalConfigService` 缓存合并
 *                          （sceneConfig + defaultLayerConfig + 写入）
 *
 * `read()` = 单一读路径（替 `getLayerConfig()` 内联读 `configService`）；
 * `apply(patch)` = 单一写路径（替 `updateLayerConfig` 内联三轨调度：
 * 选择性同步 rawConfig + pre-init 缓冲 / post-init 写穿清空）；
 * `hasPending()` 供 `prepareBuildModel` 消费 diff 触发 flush。
 *
 * 对外均字节级镜像原 `BaseLayer` 实现，运行时零行为变化；BaseLayer 侧
 * 保留 `getLayerConfig<T>()` / `updateLayerConfig()` 公开签名（含
 * `ILayer.getLayerConfig<T>()`）薄转发。`configService` 经 ctor 注入
 * 而非读 `layer.configService`（BaseLayer 该字段为 `protected`，跨类
 * 访问受限；注入保持 BaseLayer 零可见性变更）。
 *
 * `ChildLayerStyleOptions` 经泛型 `S` 透传以保留 `read<T>()` 的合并类型。
 */
export default class LayerConfigModel<S = {}> {
  private layer: BaseLayer;

  private configService: IGlobalConfigService;

  public rawConfig: Partial<ILayerConfig & S>;

  private needUpdateConfig: Partial<ILayerConfig & S>;

  constructor(
    layer: BaseLayer,
    config: Partial<ILayerConfig & S>,
    configService: IGlobalConfigService,
  ) {
    this.layer = layer;
    this.rawConfig = config;
    this.configService = configService;
  }

  /**
   * 单一读路径。返回 `configService` 缓存合并结果（`undefined` if 未 seed）。
   */
  public read<T = any>() {
    return this.configService.getLayerConfig<S & T>(this.layer.id);
  }

  /**
   * 单一写路径：选择性同步 rawConfig + 三轨调度。
   *
   *   - 仅同步 `rawConfig` 中**已存在**的键（新键不进 rawConfig，只进缓冲/缓存）
   *   - pre-init 入 `needUpdateConfig` 缓冲，不写穿 `configService`
   *   - post-init 写穿：合并 `getLayerConfig() ∪ needUpdateConfig ∪ patch`，
   *     随后清空缓冲
   */
  public apply(configToUpdate: Partial<ILayerConfig | S>) {
    // 同步 rawConfig（仅已存在键）
    Object.keys(configToUpdate).map((key) => {
      if (key in this.rawConfig) {
        (this.rawConfig as Record<string, unknown>)[key] = (
          configToUpdate as Record<string, unknown>
        )[key];
      }
    });
    if (!this.layer.startInit) {
      this.needUpdateConfig = {
        ...this.needUpdateConfig,
        ...configToUpdate,
      };
    } else {
      const sceneId = this.layer.container.id;
      this.configService.setLayerConfig(sceneId, this.layer.id, {
        ...this.configService.getLayerConfig(this.layer.id),
        ...this.needUpdateConfig,
        ...configToUpdate,
      });
      this.needUpdateConfig = {};
    }
  }

  /**
   * 是否有待 flush 的 pre-init 缓冲 diff（`prepareBuildModel` 消费）。
   * 对 `needUpdateConfig` lazy-`undefined` 初始化透明（`Object.keys(x||{})`）。
   */
  public hasPending(): boolean {
    return Object.keys(this.needUpdateConfig || {}).length !== 0;
  }
}
