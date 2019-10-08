import {
  gl,
  IRendererService,
  IShaderModuleService,
  lazyInject,
  TYPES,
} from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import FillBuffer from './buffers/FillBuffer';
import polygon_frag from './shaders/polygon_frag.glsl';
import polygon_vert from './shaders/polygon_vert.glsl';

export default class PolygonLayer extends BaseLayer {
  public name: string = 'PolygonLayer';

  @lazyInject(TYPES.IShaderModuleService)
  private readonly shaderModule: IShaderModuleService;

  @lazyInject(TYPES.IRendererService)
  private readonly renderer: IRendererService;

  public style(options: any) {
    // this.layerStyleService.update(options);
    // this.styleOptions = {
    //   ...this.styleOptions,
    //   ...options,
    // };
  }

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
    this.shaderModule.registerModule('polygon', {
      vs: polygon_vert,
      fs: polygon_frag,
    });

    this.models = [];
    const { vs, fs, uniforms } = this.shaderModule.getModule('polygon');
    const buffer = new FillBuffer({
      data: this.getEncodedData(),
    });

    const {
      createAttribute,
      createBuffer,
      createElements,
      createModel,
    } = this.renderer;

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
          a_color: createAttribute({
            buffer: createBuffer({
              data: buffer.attributes.colors,
              type: gl.FLOAT,
            }),
            size: 4,
          }),
        },
        uniforms,
        fs,
        vs,
        count: buffer.indexArray.length,
        elements: createElements({
          data: buffer.indexArray,
          type: gl.UNSIGNED_INT,
        }),
      }),
    );
  }
}
