import { WebGPUDeviceContribution } from '@antv/g-device-api';
import type { Scene } from '@antv/l7-scene';
import type { TestCase } from '../../types';

export const template: TestCase = async (options) => {
  const dom = options.id as HTMLDivElement;
  // 创建 canvas
  const $canvas = document.createElement('canvas');
  dom.appendChild($canvas);
  // 设置 canvas 大小
  $canvas.width = dom.clientWidth;
  $canvas.height = dom.clientHeight;

  const device = await render($canvas);

  const scene = {
    destroy: () => {
      dom.removeChild($canvas);
      device.destroy();
    },
  };

  return scene as Scene;
};

async function render($canvas: HTMLCanvasElement) {
  const deviceContribution = new WebGPUDeviceContribution({
    shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
  });
  const swapChain = await deviceContribution.createSwapChain($canvas);
  swapChain.configureSwapChain($canvas.width, $canvas.height);
  const device = swapChain.getDevice();

  return device;
}
