import {
  gl,
  IRendererService,
  IShaderModuleService,
  lazyInject,
  TYPES,
} from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import GridHeatMapBuffer from './buffers/GridBuffer';
import hexagon_frag from './shaders/hexagon_frag.glsl';
import hexagon_vert from './shaders/hexagon_vert.glsl';

export default class HeatMapLayer extends BaseLayer {
  public name: string = 'HeatMapLayer';

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
    this.shaderModule.registerModule('grid', {
      vs: hexagon_vert,
      fs: hexagon_frag,
    });
    this.models = [];
    const { vs, fs, uniforms } = this.shaderModule.getModule('grid');
    const buffer = new GridHeatMapBuffer({
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
          a_miter: createAttribute({
            buffer: createBuffer({
              data: buffer.instanceGeometry.positions,
              type: gl.FLOAT,
            }),
            size: 3,
            divisor: 0,
          }),
          // a_normal: createAttribute({
          //   buffer: createBuffer({
          //     data: buffer.attributes.normals,
          //     type: gl.FLOAT,
          //   }),
          //   size: 3,
          // }),
          a_color: createAttribute({
            buffer: createBuffer({
              data: buffer.attributes.colors,
              type: gl.FLOAT,
            }),
            size: 4,
            divisor: 1,
          }),
          // a_size: createAttribute({
          //   buffer: createBuffer({
          //     data: buffer.attributes.sizes,
          //     type: gl.FLOAT,
          //   }),
          //   size: 1,
          //   divisor: 1,
          // }),
          a_Position: createAttribute({
            buffer: createBuffer({
              data: buffer.attributes.positions,
              type: gl.FLOAT,
            }),
            size: 3,
            divisor: 1,
          }),
        },
        uniforms: {
          ...uniforms,
          u_opacity: (this.styleOption.opacity as number) || 1.0,
          u_radius: [
            this.getSource().data.xOffset,
            this.getSource().data.yOffset,
          ],
        },
        fs,
        vs,
        count: buffer.instanceGeometry.index.length,
        instances: buffer.verticesCount,
        elements: createElements({
          data: buffer.instanceGeometry.index,
          type: gl.UNSIGNED_INT,
        }),
      }),
    );
  }
}
