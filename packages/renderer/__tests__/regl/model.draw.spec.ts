import { gl } from '@antv/l7-core';

import { glContext } from '@antv/l7-test-utils';
import regl from 'regl';
import quad from '../../../core/src/shaders/post-processing/quad.glsl';
import ReglAttribute from '../../src/regl/ReglAttribute';
import ReglBuffer from '../../src/regl/ReglBuffer';
import ReglModel from '../../src/regl/ReglModel';
import checkPixels from './utils/check-pixels';
import globalDefaultprecision from './utils/default-precision';

describe('Initialization for ReglModel', () => {
  let reGL: regl.Regl;

  beforeEach(() => {
    reGL = regl(glContext);
  });

  it('should draw a red quad', () => {
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
      stencil: {
        enable: false,
      },
      blend: {
        enable: false,
      },
      primitive: gl.TRIANGLES,
      count: 3,
    });

    reGL.clear({
      color: [0, 0, 0, 0],
    });

    model.draw({});

    expect(checkPixels(reGL, [255])).toBeTruthy();
  });

  it('should cull front face', () => {
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
      count: 3,
      cull: {
        enable: true,
        face: gl.FRONT,
      },
    });

    reGL.clear({
      color: [0, 0, 0, 0],
    });

    model.draw({});

    expect(checkPixels(reGL, [0])).toBeTruthy();
  });

  it('should draw with instances', () => {
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
      count: 3,
      instances: 1,
    });

    reGL.clear({
      color: [0, 0, 0, 0],
    });

    model.draw({});

    expect(checkPixels(reGL, [255])).toBeTruthy();
  });

  it('should draw with uniforms', () => {
    const model = new ReglModel(reGL, {
      vs: quad,
      fs: `
        ${globalDefaultprecision}
        uniform vec4 u_Color;
        void main() {
          gl_FragColor = u_Color;
        }
      `,
      attributes: {
        a_Position: new ReglAttribute(reGL, {
          buffer: new ReglBuffer(reGL, {
            data: [-4, -4, 4, -4, 0, 4],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      uniforms: {
        u_Color: [0, 0, 0, 0],
      },
      depth: {
        enable: false,
      },
      count: 3,
    });

    reGL.clear({
      color: [0, 0, 0, 0],
    });

    model.draw({
      uniforms: {
        u_Color: [1, 0, 0, 1],
      },
    });

    expect(checkPixels(reGL, [255])).toBeTruthy();
  });
});
