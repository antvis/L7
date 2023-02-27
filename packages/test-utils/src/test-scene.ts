import { IMapOptions } from '@antv/l7-map';
import { Map } from '@antv/l7-maps';
import { Scene } from '@antv/l7-scene';
import regl from 'l7regl';
import createContext from './create-context';

export function TestScene(options?: Partial<IMapOptions>) {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  const body = document.querySelector('body') as HTMLBodyElement;
  body.appendChild(el);

  const context = createContext(400, 300);
  const reGL = regl({
    gl: context,
    attributes: {
      alpha: true,
      // use TAA instead of MSAA
      // @see https://www.khronos.org/registry/webgl/specs/1.0/#5.2.1
      antialias: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,

      stencil: true,
    },
    extensions: [
      'ANGLE_instanced_arrays',
      'STACKGL_resize_drawingbuffer',
      'STACKGL_destroy_context',
      'OES_element_index_uint',
      'OES_standard_derivatives',
      'OES_texture_float',
      'OES_texture_float_linear',
      'WEBGL_draw_buffers',
      'EXT_blend_minmax',
      'EXT_texture_filter_anisotropic',
      'OES_vertex_array_object',
    ],
  });
  const scene = new Scene({
    id: el,
    gl: reGL,
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
