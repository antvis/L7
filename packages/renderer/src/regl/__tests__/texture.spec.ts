import { gl } from '@antv/l7-core';
import { createContext } from '@antv/l7-test-utils';
import regl from 'l7regl';
import 'reflect-metadata';
import copy from '../../../../core/src/shaders/post-processing/copy.glsl';
import quad from '../../../../core/src/shaders/post-processing/quad.glsl';
import ReglAttribute from '../ReglAttribute';
import ReglBuffer from '../ReglBuffer';
import ReglModel from '../ReglModel';
import ReglTexture2D from '../ReglTexture2D';
import checkPixels from './utils/check-pixels';
import globalDefaultprecision from './utils/default-precision';

describe('ReglTexture', () => {
  let context;
  let reGL: regl.Regl;

  beforeEach(() => {
    context = createContext(1, 1);
    reGL = regl(context);
  });

  it('should initialize with `data`', () => {
    const model = new ReglModel(reGL, {
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
        u_Texture: new ReglTexture2D(reGL, {
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

  it('should resize texture', () => {
    const texture = new ReglTexture2D(reGL, {
      width: 1,
      height: 1,
      data: [255, 0, 0, 255],
    });
    const model = new ReglModel(reGL, {
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
        u_Texture: texture,
      },
      depth: {
        enable: false,
      },
      count: 3,
    });

    reGL.clear({
      color: [0, 0, 0, 0],
    });

    texture.resize({
      width: 1,
      height: 1,
    });

    model.draw({});

    texture.destroy();

    // 全屏应该都是红色
    expect(checkPixels(reGL, [255])).toBeTruthy();
  });

  it('should mipmap with default options', () => {
    const texture = new ReglTexture2D(reGL, {
      width: 1,
      height: 1,
      data: [255, 0, 0, 255],
      mipmap: true,
    });
    const model = new ReglModel(reGL, {
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
        u_Texture: texture,
      },
      depth: {
        enable: false,
      },
      count: 3,
    });

    reGL.clear({
      color: [0, 0, 0, 0],
    });

    texture.resize({
      width: 1,
      height: 1,
    });

    model.draw({});

    texture.destroy();

    // 全屏应该都是红色
    expect(checkPixels(reGL, [255])).toBeTruthy();
  });

  it('should mipmap with hints', () => {
    const texture = new ReglTexture2D(reGL, {
      width: 1,
      height: 1,
      data: [255, 0, 0, 255],
      mipmap: gl.DONT_CARE,
    });
    const model = new ReglModel(reGL, {
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
        u_Texture: texture,
      },
      depth: {
        enable: false,
      },
      count: 3,
    });

    reGL.clear({
      color: [0, 0, 0, 0],
    });

    texture.resize({
      width: 1,
      height: 1,
    });

    model.draw({});

    texture.destroy();

    // 全屏应该都是红色
    expect(checkPixels(reGL, [255])).toBeTruthy();
  });
});
