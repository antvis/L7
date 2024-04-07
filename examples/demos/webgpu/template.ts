import { WebGPUDeviceContribution } from '@antv/g-device-api';
export async function MapRender(option: { map: string; renderer: 'regl' | 'device' }) {
  const dom = document.getElementById('map') as HTMLDivElement;
  // 创建 canvas
  const $canvas = document.createElement('canvas');
  dom.appendChild($canvas);
  // 设置 canvas 大小
  $canvas.width = dom.clientWidth;
  $canvas.height = dom.clientHeight;
  const deviceContribution = new WebGPUDeviceContribution({
    shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
  });
  const swapChain = await deviceContribution.createSwapChain($canvas);
  swapChain.configureSwapChain($canvas.width, $canvas.height);
  const device = swapChain.getDevice();
}
