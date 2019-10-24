// import {
//   gl,
//   IRendererService,
//   IShaderModuleService,
//   lazyInject,
//   TYPES,
// } from '@l7/core';
// import BaseLayer from '../core/BaseLayer';
// import LineBuffer from './buffers/line';
// import line_frag from './shaders/line_frag.glsl';
// import line_vert from './shaders/line_vert.glsl';
// export default class LineLayer extends BaseLayer {
//   public name: string = 'LineLayer';
//   @lazyInject(TYPES.IShaderModuleService)
//   private readonly shaderModule: IShaderModuleService;

//   @lazyInject(TYPES.IRendererService)
//   private readonly renderer: IRendererService;

//   protected renderModels() {
//     this.models.forEach((model) =>
//       model.draw({
//         uniforms: {
//           u_ModelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
//         },
//       }),
//     );
//     return this;
//   }
//   protected buildModels(): void {
//     this.shaderModule.registerModule('line', {
//       vs: line_vert,
//       fs: line_frag,
//     });

//     this.models = [];
//     const { vs, fs, uniforms } = this.shaderModule.getModule('line');
//     const buffer = new LineBuffer({
//       data: this.getEncodedData(),
//       style: this.styleOption,
//     });
//     const {
//       createAttribute,
//       createBuffer,
//       createElements,
//       createModel,
//     } = this.renderer;

//     this.models.push(
//       createModel({
//         attributes: {
//           a_Position: createAttribute({
//             buffer: createBuffer({
//               data: buffer.attributes.positions,
//               type: gl.FLOAT,
//             }),
//             size: 3,
//           }),
//           a_normal: createAttribute({
//             buffer: createBuffer({
//               data: buffer.attributes.normals,
//               type: gl.FLOAT,
//             }),
//             size: 3,
//           }),
//           a_color: createAttribute({
//             buffer: createBuffer({
//               data: buffer.attributes.colors,
//               type: gl.FLOAT,
//             }),
//             size: 4,
//           }),
//           a_size: createAttribute({
//             buffer: createBuffer({
//               data: buffer.attributes.sizes,
//               type: gl.FLOAT,
//             }),
//             size: 1,
//           }),
//           a_miter: createAttribute({
//             buffer: createBuffer({
//               data: buffer.attributes.miters,
//               type: gl.FLOAT,
//             }),
//             size: 1,
//           }),
//         },
//         uniforms: {
//           ...uniforms,
//           u_opacity: this.styleOption.opacity as number,
//         },
//         fs,
//         vs,
//         count: buffer.indexArray.length,
//         elements: createElements({
//           data: buffer.indexArray,
//           type: gl.UNSIGNED_INT,
//         }),
//       }),
//     );
//   }
// }
