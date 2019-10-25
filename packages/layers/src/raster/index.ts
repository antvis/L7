// import {
//   gl,
//   IRendererService,
//   IShaderModuleService,
//   ITexture2D,
//   lazyInject,
//   TYPES,
// } from '@l7/core';
// import BaseLayer from '../core/BaseLayer';
// import ImageBuffer from './buffers/ImageBuffer';
// import image_frag from './shaders/image_frag.glsl';
// import image_vert from './shaders/image_vert.glsl';
// export default class ImageLayer extends BaseLayer {
//   public name: string = 'imageLayer';
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
//   protected buildModels() {
//     const {
//       createAttribute,
//       createBuffer,
//       createElements,
//       createTexture2D,
//       createModel,
//     } = this.renderer;
//     this.shaderModule.registerModule('image', {
//       vs: image_vert,
//       fs: image_frag,
//     });

//     this.models = [];
//     const { vs, fs, uniforms } = this.shaderModule.getModule('image');
//     const source = this.getSource();
//     // const imageData = await source.data.images;
//     const buffer = new ImageBuffer({
//       data: this.getEncodedData(),
//     });
//     source.data.images.then((imageData: HTMLImageElement[]) => {
//       const texture: ITexture2D = createTexture2D({
//         data: imageData[0],
//         width: imageData[0].width,
//         height: imageData[0].height,
//       });
//       this.models.push(
//         createModel({
//           attributes: {
//             a_Position: createAttribute({
//               buffer: createBuffer({
//                 data: buffer.attributes.positions,
//                 type: gl.FLOAT,
//               }),
//               size: 3,
//             }),
//             a_uv: createAttribute({
//               buffer: createBuffer({
//                 data: buffer.attributes.uv,
//                 type: gl.FLOAT,
//               }),
//               size: 2,
//             }),
//           },
//           uniforms: {
//             ...uniforms,
//             u_texture: texture,
//             u_opacity: 1.0,
//           },
//           fs,
//           vs,
//           count: buffer.verticesCount,
//         }),
//       );
//     });
//   }
// }
