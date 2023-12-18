import type { IPostProcessingPass } from '@antv/l7-core';

export default interface IPostProcessingPassPluggable {
  /**
   * 注册自定义后处理效果
   * @param constructor 效果构造函数
   * @param name 效果名，便于在 Layer 中引用
   */
  registerPostProcessingPass(
    constructor: new (...args: any[]) => IPostProcessingPass<unknown>,
    name: string,
  ): void;
}
