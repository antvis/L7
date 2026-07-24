import type BaseLayer from './BaseLayer';

/**
 * 动画运行态与时钟读取 delegate（阶段 1.5）。
 *
 * 收口 BaseLayer 中动画运行态：
 * - 状态 `animateStartTime` / `animateStatus`（均原 private 字段，仅本组方法
 *   与 prepareBuildModel 启动钩子读写；`animateStatus` 另被
 *   `LayerAnimateStylePlugin` 经 `@ts-ignore` 直读 `layer.animateStatus`，
 *   故 BaseLayer 保留 public getter 桥接到本 delegate，运行时读取不变）
 * - 时钟读取 `getTime`（clock.getDelta）/ `getLayerAnimateTime`
 * - 控制 `setAnimateStartTime` / `stopAnimate`（layerService.stopAnimate +
 *   `updateLayerConfig` 关闭 animateOption）、`prepareAnimate`（原
 *   prepareBuildModel 内联启动块）
 *
 * 原 protected dead 字段 `animateOptions`（配置实走 `getLayerConfig().animateOption`）
 * 一并清理。`layerService` 在 BaseLayer 为 protected getter，本类经公开
 * `this.layer.container.layerService` 访问（同 `LayerVisibilityZoom` 先例）。
 * 对外签名均为薄转发，零 API/行为变更。
 */
export default class LayerAnimateState {
  private layer: BaseLayer;
  private animateStartTime: number = 0;
  private animateStatus: boolean = false;

  constructor(layer: BaseLayer) {
    this.layer = layer;
  }

  /**
   * prepareBuildModel 启动动画钩子（原内联块字节级镜像）。
   */
  public prepareAnimate() {
    const { animateOption } = this.layer.getLayerConfig();
    if (animateOption?.enable) {
      this.layer.container.layerService.startAnimate();
      this.animateStatus = true;
    }
  }

  public getTime() {
    return this.layer.container.layerService.clock.getDelta();
  }

  public setAnimateStartTime() {
    this.animateStartTime = this.layer.container.layerService.clock.getElapsedTime();
  }

  public stopAnimate() {
    if (this.animateStatus) {
      this.layer.container.layerService.stopAnimate();
      this.animateStatus = false;
      this.layer.updateLayerConfig({
        animateOption: {
          enable: false,
        },
      });
    }
  }

  public getLayerAnimateTime(): number {
    return this.layer.container.layerService.clock.getElapsedTime() - this.animateStartTime;
  }

  public getAnimateStatus(): boolean {
    return this.animateStatus;
  }
}
