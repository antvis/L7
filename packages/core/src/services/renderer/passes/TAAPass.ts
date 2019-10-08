// import { inject, injectable } from 'inversify';
// import { ILayer, ILayerService } from '../../layer/ILayerService';
// import { IPass, PassType } from '../IMultiPassRenderer';

// // Generate halton sequence
// // https://en.wikipedia.org/wiki/Halton_sequence
// function halton(index: number, base: number) {
//   let result = 0;
//   let f = 1 / base;
//   let i = index;
//   while (i > 0) {
//     result = result + f * (i % base);
//     i = Math.floor(i / base);
//     f = f / base;
//   }
//   return result;
// }

// // 累加计数器
// let accumulatingId = 1;

// /**
//  * TAA（Temporal Anti-Aliasing）
//  * 在需要后处理的场景中（例如 L7 的热力图需要 blur pass、PBR 中的 SSAO 环境光遮蔽），无法使用浏览器内置的 MSAA，
//  * 只能使用 TAA
//  * @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/ri52hv
//  */
// @injectable()
// export default class TAAPass implements IPass {
//   private haltonSequence: Array<[number, number]> = [];

//   // 当前累加任务 ID
//   private accumulatingId: number = 0;

//   private frame: number = 0;

//   private timer: number | undefined = undefined;

//   public getType() {
//     return PassType.Normal;
//   }

//   public init(layer: ILayer) {
//     this.scene = scene;
//     this.camera = camera;

//     for (let i = 0; i < 30; i++) {
//       this.haltonSequence.push([halton(i, 2), halton(i, 3)]);
//     }

//     // weigh accumulating
//     this.blendPass = new ShaderPass(BlendShader);
//   }

//   public render(layer: ILayer) {
//     //
//   }

//   /**
//    * 是否已经完成累加
//    * @return {boolean} isFinished
//    */
//   private isFinished() {
//     return this.frame >= this.haltonSequence.length;
//   }

//   private resetFrame() {
//     this.frame = 0;
//   }

//   private stopAccumulating() {
//     this.accumulatingId = 0;
//     window.clearTimeout(this.timer);
//   }
// }
