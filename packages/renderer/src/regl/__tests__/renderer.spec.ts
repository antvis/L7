import { gl } from '@antv/l7-core';
import regl from 'l7regl';
import 'reflect-metadata';
import copy from '../../../../core/src/shaders/post-processing/copy.glsl';
import quad from '../../../../core/src/shaders/post-processing/quad.glsl';
import { ReglRendererService } from '../../index';
import ReglAttribute from '../ReglAttribute';
import ReglBuffer from '../ReglBuffer';
import checkPixels from './utils/check-pixels';
import createContext from './utils/create-context';
import globalDefaultprecision from './utils/default-precision';

describe('ReglRendererService', () => {
  let context;
  let reGL: regl.Regl;
  const rendererService = new ReglRendererService();

  beforeEach(() => {
    context = createContext(1, 1);
    reGL = regl(context);
    // @ts-ignore
    rendererService.gl = reGL;
  });

  it('should getViewportSize correctly after setViewport', () => {
    const { viewport, getViewportSize } = rendererService;
    const { width, height } = getViewportSize();
    expect(width).toEqual(1);
    expect(height).toEqual(1);

    viewport({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    });

    expect(width).toEqual(1);
    expect(height).toEqual(1);
  });

  it('should create model with createModel API', () => {
    const {
      clear,
      createModel,
      createAttribute,
      createBuffer,
    } = rendererService;
    const model = createModel({
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: createAttribute({
          buffer: createBuffer({
            data: [
              [-4, -4],
              [4, -4],
              [0, 4],
            ],
            type: gl.FLOAT,
          }),
        }),
      },
      depth: {
        enable: false,
      },
      count: 3,
    });

    clear({
      color: [0, 0, 0, 0],
    });

    model.draw({});

    expect(checkPixels(reGL, [255])).toBeTruthy();
  });

  it('should draw with createElements', () => {
    const {
      clear,
      createModel,
      createAttribute,
      createBuffer,
      createElements,
    } = rendererService;
    const model = createModel({
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: createAttribute({
          buffer: createBuffer({
            data: [
              [-4, -4],
              [4, -4],
              [0, 4],
            ],
            type: gl.FLOAT,
          }),
        }),
      },
      depth: {
        enable: false,
      },
      elements: createElements({
        data: [0, 1, 2],
        count: 3,
      }),
    });

    clear({
      color: [0, 0, 0, 0],
    });

    model.draw({});

    expect(checkPixels(reGL, [255])).toBeTruthy();
  });

  it('should render to framebuffer with `useFramebuffer` correctly', () => {
    const {
      clear,
      createModel,
      createAttribute,
      createBuffer,
      createFramebuffer,
      useFramebuffer,
    } = rendererService;
    const model = createModel({
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: createAttribute({
          buffer: createBuffer({
            data: [
              [-4, -4],
              [4, -4],
              [0, 4],
            ],
            type: gl.FLOAT,
          }),
        }),
      },
      depth: {
        enable: false,
      },
      count: 3,
    });
    const framebuffer = createFramebuffer({
      width: 1,
      height: 1,
    });

    useFramebuffer(framebuffer, () => {
      clear({
        color: [0, 0, 0, 0],
        framebuffer,
      });
      model.draw({});
      expect(checkPixels(reGL, [255])).toBeTruthy();
    });

    // render to screen
    useFramebuffer(null, () => {
      clear({
        color: [0, 0, 0, 0],
      });
      model.draw({});
      expect(checkPixels(reGL, [255])).toBeTruthy();
    });
  });

  it('should readPixels correctly', () => {
    const {
      clear,
      createModel,
      createAttribute,
      createBuffer,
      createFramebuffer,
      useFramebuffer,
      readPixels,
      destroy,
    } = rendererService;
    const model = createModel({
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: createAttribute({
          buffer: createBuffer({
            data: [
              [-4, -4],
              [4, -4],
              [0, 4],
            ],
            type: gl.FLOAT,
          }),
        }),
      },
      depth: {
        enable: false,
      },
      count: 3,
    });
    const framebuffer = createFramebuffer({
      width: 1,
      height: 1,
    });

    useFramebuffer(framebuffer, () => {
      clear({
        color: [0, 0, 0, 0],
        framebuffer,
      });
      model.draw({});

      const pixels = readPixels({
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        framebuffer,
      });
      expect(pixels[0]).toBe(255);
    });

    // render to screen
    useFramebuffer(null, () => {
      clear({
        color: [0, 0, 0, 0],
      });
      model.draw({});
      const pixels = readPixels({
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        framebuffer: undefined,
      });
      expect(pixels[0]).toBe(255);
    });

    destroy();
  });

  it('should render a fullscreen texture', () => {
    const { createModel, createTexture2D } = rendererService;
    const model = createModel({
      vs: quad,
      fs: globalDefaultprecision + copy,
      attributes: {
        a_Position: new ReglAttribute(reGL, {
          buffer: new ReglBuffer(reGL, {
            data: [
              [-4, -4],
              [4, -4],
              [0, 4],
            ],
            type: gl.FLOAT,
          }),
        }),
      },
      uniforms: {
        // 创建一个红色的纹理
        u_Texture: createTexture2D({
          width: 1,
          height: 1,
          data: [255, 0, 0, 255],
        }),
      },
      depth: {
        enable: false,
      },
      count: 3,
    });

    reGL.clear({
      color: [0, 0, 0, 0],
    });

    model.draw({});

    // 全屏应该都是红色
    expect(checkPixels(reGL, [255])).toBeTruthy();
  });

  it('should getContainer correctly', () => {
    const { getContainer } = rendererService;
    expect(getContainer()).toBeUndefined();
  });
});
