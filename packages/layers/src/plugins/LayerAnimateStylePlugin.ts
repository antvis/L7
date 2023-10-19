import { ILayer, ILayerPlugin, IModel, IRendererService } from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export default class LayerAnimateStylePlugin implements ILayerPlugin {
  public apply(
    layer: ILayer,
    {
      rendererService,
    }: {
      rendererService: IRendererService;
    },
  ) {
    // Create a Uniform Buffer Object(UBO).
    const uniformBuffer = rendererService.createBuffer({
      data: new Float32Array([
        ...[1, 2, 1.0, 0.2], // vec4 u_animate
        0, // u_time
      ]),
      isUBO: true,
    });
    rendererService.uniformBuffers[2] = uniformBuffer;

    layer.hooks.beforeRender.tap('LayerAnimateStylePlugin', () => {
      // @ts-ignore
      const animateStatus = layer.animateStatus;
      if (animateStatus) {
        layer.models.forEach((model: IModel) => {
          const uniforms = layer.layerModel.getAnimateUniforms();
          if (uniforms) {
            uniformBuffer.subData({
              offset: 0,
              data: new Uint8Array(
                new Float32Array([
                  ...((uniforms.u_animate as number[]) || [0, 0, 0, 0]),
                  uniforms.u_time as number,
                ]).buffer,
              ),
            });
            model.addUniforms({
              ...uniforms,
            });
          }
        });
      }
    });
  }
}
