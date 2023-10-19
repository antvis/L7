import { createContext } from '@antv/l7-test-utils';
import { WebGLDeviceContribution } from '@strawberry-vis/g-device-api';

export async function getWebGLDevice() {
  const deviceContribution = new WebGLDeviceContribution({
    targets: ['webgl1'],
  });

  const width = 100;
  const height = 100;
  let gl = createContext(width, height);

  const mockCanvas: HTMLCanvasElement = {
    width,
    height,
    // @ts-ignore
    getContext: () => {
      // @ts-ignore
      gl.canvas = mockCanvas;
      // 模拟 DOM API，返回小程序 context，它应当和 CanvasRenderingContext2D 一致
      // @see https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext
      return gl;
    },
  };
  // create swap chain and get device
  const swapChain = await deviceContribution.createSwapChain(mockCanvas);
  swapChain.configureSwapChain(width, height);
  return swapChain.getDevice();
}
