import {
  gl,
  IRendererService,
  IShaderModuleService,
  lazyInject,
  TYPES,
} from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import ExtrudeBuffer from './buffers/ExtrudeBuffer';
import FillBuffer from './buffers/FillBuffer';
import polygon_frag from './shaders/polygon_frag.glsl';
import polygon_vert from './shaders/polygon_vert.glsl';

export default class PolygonLayer extends BaseLayer {
  public name: string = 'PolygonLayer';

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
    this.shaderModule.registerModule('polygon', {
      vs: polygon_vert,
      fs: polygon_frag,
    });

    this.models = [];
    const { vs, fs, uniforms } = this.shaderModule.getModule('polygon');
    const buffer = new ExtrudeBuffer({
      data: this.getEncodedData(),
    });
    buffer.computeVertexNormals();
    const buffer2 = new FillBuffer({
      data: this.getEncodedData(),
    });
    console.log(buffer);
    console.log(buffer2);
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
        },
        uniforms: {
          ...uniforms,
          u_opacity: this.styleOption.opacity as number,
        },
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
