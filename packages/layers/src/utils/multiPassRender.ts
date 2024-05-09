import type { ILayer, IPass, IPostProcessingPass } from '@antv/l7-core';

/**
 * 'blurH' -> ['blurH', {}]
 */
export function normalizePasses(passes: Array<string | [string, { [key: string]: unknown }]>) {
  return passes.map((pass: string | [string, { [key: string]: unknown }]) => {
    if (typeof pass === 'string') {
      pass = [pass, {}];
    }
    return pass;
  });
}

/**
 * 默认添加 ClearPass、RenderPass
 * 以及 PostProcessing 中的最后一个 CopyPass
 */
export function createMultiPassRenderer(
  layer: ILayer,
  passes: Array<string | [string, { [key: string]: unknown }]>,
  postProcessingPassFactory: (name: string) => IPostProcessingPass<unknown>,
  normalPassFactory: (name: string) => IPass<unknown>,
) {
  const multiPassRenderer = layer.multiPassRenderer;

  // picking pass if enabled
  // if (enablePicking) {
  //   multiPassRenderer.add(normalPassFactory('pixelPicking'));
  // }

  // render all layers in this pass
  multiPassRenderer.add(normalPassFactory('render'));

  // post processing
  normalizePasses(passes).forEach((pass: [string, { [key: string]: unknown }]) => {
    const [passName, initializationOptions] = pass;
    multiPassRenderer.add(postProcessingPassFactory(passName), initializationOptions);
  });

  // 末尾为固定的 CopyPass
  multiPassRenderer.add(postProcessingPassFactory('copy'));

  return multiPassRenderer;
}
