import {
  gl,
  IIconService,
  IRendererService,
  IShaderModuleService,
  lazyInject,
  TYPES,
} from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import ExtrudeBuffer from './buffers/ExtrudeBuffer';
import ImageBuffer from './buffers/ImageBuffer';
import extrude_frag from './shaders/extrude_frag.glsl';
import extrude_vert from './shaders/extrude_vert.glsl';
import image_frag from './shaders/image_frag.glsl';
import image_vert from './shaders/image_vert.glsl';

export default class PointLayer extends BaseLayer {
  public name: string = 'PointLayer';

  @lazyInject(TYPES.IShaderModuleService)
  private readonly shaderModule: IShaderModuleService;

  @lazyInject(TYPES.IRendererService)
  private readonly renderer: IRendererService;


  protected renderModels() {
    this.models.forEach((model) =>
      model.draw({
        uniforms: {
          u_ModelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        },
      }),
    );
    return this;
  }

  protected buildModels(): void {
    this.shaderModule.registerModule('point', {
      vs: extrude_vert,
      fs: extrude_frag,
    });
    this.shaderModule.registerModule('pointImage', {
      vs: image_vert,
      fs: image_frag,
    });

    this.models = [];
    const { vs, fs, uniforms } = this.shaderModule.getModule('pointImage');
    // const buffer = new ExtrudeBuffer({
    //   data: this.getEncodedData(),
    // });
    // buffer.computeVertexNormals('miters', false);
    const {
      createAttribute,
      createBuffer,
      createElements,
      createTexture2D,
      createModel,
    } = this.renderer;
    const buffer = new ImageBuffer({
      data: this.getEncodedData(),
      iconMap: this.iconService.getIconMap(),
    });
    this.models.push(
      createModel({
        attributes: {
          a_Position: createAttribute({
            buffer: createBuffer({
              data: buffer.attributes.positions,
              type: gl.FLOAT,
            }),
            size: 3,
          }),
          a_normal: createAttribute({
            buffer: createBuffer({
              data: buffer.attributes.normals,
              type: gl.FLOAT,
            }),
            size: 3,
          }),
          a_color: createAttribute({
            buffer: createBuffer({
              data: buffer.attributes.colors,
              type: gl.FLOAT,
            }),
            size: 4,
          }),
          a_size: createAttribute({
            buffer: createBuffer({
              data: buffer.attributes.sizes,
              type: gl.FLOAT,
            }),
            size: 1,
          }),
          a_uv: createAttribute({
            buffer: createBuffer({
              data: buffer.attributes.uv,
              type: gl.FLOAT,
            }),
            size: 2,
          }),
          // a_shape: createAttribute({
          //   buffer: createBuffer({
          //     data: buffer.attributes.miters,
          //     type: gl.FLOAT,
          //   }),
          //   size: 3,
          // }),
        },
        uniforms: {
          ...uniforms,
          u_opacity: this.styleOption.opacity as number,
          u_texture: createTexture2D({
            data: this.iconService.getCanvas(),
            width: 1024,
            height: this.iconService.canvasHeight,
          }),
        },
        fs,
        vs,
        primitive: gl.POINTS,
        count: buffer.verticesCount,
        // elements: createElements({
        //   data: buffer.indexArray,
        //   type: gl.UNSIGNED_INT,
        // }),
      }),
    );
  }
}
