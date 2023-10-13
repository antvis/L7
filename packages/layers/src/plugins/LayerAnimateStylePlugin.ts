import {
  IBuffer,
  ILayer,
  ILayerPlugin,
  ILayerService,
  IModel,
  IRendererService,
  TYPES,
} from '@antv/l7-core';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export default class LayerAnimateStylePlugin implements ILayerPlugin {
  @inject(TYPES.ILayerService)
  private readonly layerService: ILayerService;

  public apply(
    layer: ILayer,
    {
      rendererService,
    }: {
      rendererService: IRendererService;
    },
  ) {
    let uniformBuffer: IBuffer;
    if (!rendererService.uniformBuffers[2]) {
      // Create a Uniform Buffer Object(UBO).
      uniformBuffer = rendererService.createBuffer({
        data: new Float32Array([
          ...[1, 2, 1.0, 0.2], // vec4 u_animate
          0, // u_time
          0, // padding
          0,
          0,
        ]),
        isUBO: true,
      });
      rendererService.uniformBuffers[2] = uniformBuffer;
    }

    layer.hooks.beforeRender.tap('LayerAnimateStylePlugin', () => {
      // @ts-ignore
      const animateStatus = layer.animateStatus;
      if (animateStatus) {
        layer.models.forEach((model: IModel) => {
          const uniforms = layer.layerModel.getAnimateUniforms();
          if (uniforms) {
            if (this.layerService.alreadyInRendering && uniformBuffer) {
              uniformBuffer.subData({
                offset: 0,
                data: new Uint8Array(
                  new Float32Array([
                    ...((uniforms.u_animate as number[]) || [1, 2, 1.0, 0.2]),
                    uniforms.u_time as number,
                  ]).buffer,
                ),
              });
            }
            model.addUniforms({
              ...uniforms,
            });
          }
        });
      }
    });
  }
}
