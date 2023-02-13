import { gl } from '@antv/l7-core';
import { createContext } from '@antv/l7-test-utils';
import regl from 'l7regl';
import 'reflect-metadata';
import quad from '../../../../core/src/shaders/post-processing/quad.glsl';
import ReglAttribute from '../ReglAttribute';
import ReglBuffer from '../ReglBuffer';
import ReglElements from '../ReglElements';
import ReglFramebuffer from '../ReglFramebuffer';
import ReglModel from '../ReglModel';
import ReglRenderbuffer from '../ReglRenderbuffer';
import ReglTexture2D from '../ReglTexture2D';
import checkPixels from './utils/check-pixels';

describe('ReglFramebuffer', () => {
  let context;
  let reGL: regl.Regl;

  beforeEach(() => {
    context = createContext(1, 1);
    reGL = regl(context);
  });

  it('should initialize correctly', () => {
    const model = new ReglModel(reGL, {
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: new ReglAttribute(reGL, {
          buffer: new ReglBuffer(reGL, {
            data: [-4, -4, 4, -4, 0, 4],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      depth: {
        enable: false,
      },
      elements: new ReglElements(reGL, {
        data: [0, 1, 2],
        count: 3,
      }),
    });
    const framebuffer = new ReglFramebuffer(reGL, {
      color: new ReglTexture2D(reGL, {
        width: 1,
        height: 1,
      }),
    });

    reGL({ framebuffer: framebuffer.get() })(() => {
      reGL.clear({
        color: [0, 0, 0, 0],
      });
      model.draw({});
      expect(checkPixels(reGL, [255])).toBeTruthy();
    });
  });

  it('should initialize with colors correctly', () => {
    const model = new ReglModel(reGL, {
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: new ReglAttribute(reGL, {
          buffer: new ReglBuffer(reGL, {
            data: [-4, -4, 4, -4, 0, 4],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      depth: {
        enable: false,
      },
      elements: new ReglElements(reGL, {
        data: [0, 1, 2],
        count: 3,
      }),
    });
    const framebuffer = new ReglFramebuffer(reGL, {
      colors: [
        new ReglTexture2D(reGL, {
          width: 1,
          height: 1,
        }),
      ],
    });

    reGL({ framebuffer: framebuffer.get() })(() => {
      reGL.clear({
        color: [0, 0, 0, 0],
      });
      model.draw({});
      expect(checkPixels(reGL, [255])).toBeTruthy();
    });
  });

  it('should resize correctly', () => {
    const model = new ReglModel(reGL, {
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: new ReglAttribute(reGL, {
          buffer: new ReglBuffer(reGL, {
            data: [-4, -4, 4, -4, 0, 4],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      depth: {
        enable: false,
      },
      elements: new ReglElements(reGL, {
        data: [0, 1, 2],
        count: 3,
      }),
    });
    const framebuffer = new ReglFramebuffer(reGL, {
      color: new ReglTexture2D(reGL, {
        width: 1,
        height: 1,
      }),
    });

    framebuffer.resize({
      width: 1,
      height: 1,
    });

    reGL({ framebuffer: framebuffer.get() })(() => {
      reGL.clear({
        color: [0, 0, 0, 0],
      });
      model.draw({});
      expect(checkPixels(reGL, [255])).toBeTruthy();
    });

    framebuffer.destroy();
  });

  it('should initialize with renderbuffer correctly', () => {
    const model = new ReglModel(reGL, {
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: new ReglAttribute(reGL, {
          buffer: new ReglBuffer(reGL, {
            data: [-4, -4, 4, -4, 0, 4],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      depth: {
        enable: false,
      },
      elements: new ReglElements(reGL, {
        data: [0, 1, 2],
        count: 3,
      }),
    });

    const renderbuffer = new ReglRenderbuffer(reGL, {
      width: 1,
      height: 1,
      format: gl.RGBA4,
    });
    const framebuffer = new ReglFramebuffer(reGL, {
      color: renderbuffer,
    });

    renderbuffer.resize({
      width: 1,
      height: 1,
    });

    reGL({ framebuffer: framebuffer.get() })(() => {
      reGL.clear({
        color: [0, 0, 0, 0],
      });
      model.draw({});
    });

    framebuffer.destroy();
    renderbuffer.destroy();
  });
});
