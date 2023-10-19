import { gl } from '@antv/l7-core';
import 'reflect-metadata';
import quad from '../../../../core/src/shaders/post-processing/quad.glsl';
import DeviceAttribute from '../DeviceAttribute';
import DeviceBuffer from '../DeviceBuffer';
import DeviceModel from '../DeviceModel';
// import checkPixels from './utils/check-pixels';
import { Device } from '@strawberry-vis/g-device-api';
import { getWebGLDevice } from './utils/device';

describe('DeviceAttribute', () => {
  let device: Device;

  beforeAll(async () => {
    device = await getWebGLDevice();
  });

  // it('should initialize without `size`', () => {
  //   const attribute = new DeviceAttribute(reGL, {
  //     buffer: new DeviceBuffer(reGL, {
  //       data: [
  //         [-4, -4],
  //         [4, -4],
  //         [0, 4],
  //       ],
  //       type: gl.FLOAT,
  //     }),
  //   });
  //   const model = new DeviceModel(reGL, {
  //     vs: quad,
  //     fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
  //     attributes: {
  //       a_Position: attribute,
  //     },
  //     depth: {
  //       enable: false,
  //     },
  //     count: 3,
  //   });

  //   reGL.clear({
  //     color: [0, 0, 0, 0],
  //   });

  //   attribute.updateBuffer({
  //     data: [-4, -4, 4, -4, 0, 4],
  //     offset: 0,
  //   });

  //   model.draw({});

  //   attribute.destroy();

  //   expect(checkPixels(reGL, [255])).toBeTruthy();
  // });

  it('should update buffer correctly', () => {
    const attribute = new DeviceAttribute(device, {
      shaderLocation: 0,
      buffer: new DeviceBuffer(device, {
        data: [-4, -4, 4, -4, 0, 4],
        type: gl.FLOAT,
      }),
      size: 2,
    });
    const model = new DeviceModel(device, {
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: attribute,
      },
      depth: {
        enable: false,
      },
      count: 3,
    });

    // reGL.clear({
    //   color: [0, 0, 0, 0],
    // });

    attribute.updateBuffer({
      data: [-4, -4, 4, -4, 0, 4],
      offset: 0,
    });

    model.draw({});

    attribute.destroy();

    // expect(checkPixels(reGL, [255])).toBeTruthy();
  });
});
