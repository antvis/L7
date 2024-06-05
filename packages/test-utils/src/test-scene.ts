import type { IMapConfig } from '@antv/l7-core';
import { Map } from '@antv/l7-maps';
import { Scene } from '@antv/l7-scene';
import { glContext } from './gl-context';

export function TestScene(options?: Partial<IMapConfig>) {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  const width = 400;
  const height = 300;

  const mockCanvas = document.createElement('canvas');
  // @ts-ignore
  mockCanvas.getContext = () => {
    // @ts-ignore
    glContext.canvas = mockCanvas;
    // 模拟 DOM API，返回小程序 context，它应当和 CanvasRenderingContext2D 一致
    // @see https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext
    return glContext;
  };

  const body = document.querySelector('body') as HTMLBodyElement;
  body.appendChild(el);
  // @ts-ignore
  el.getBoundingClientRect = jest.fn(() => ({
    x: 0,
    y: 0,
    width: width,
    height: height,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
  }));

  const scene = new Scene({
    id: el,
    canvas: mockCanvas,
    map: new Map({
      style: 'dark',
      center: [110.19382669582967, 30.258134],
      pitch: 0,
      zoom: 3,
      ...options,
    }),
  });

  return scene;
}
