import createContext from './create-context';
import { Scene } from '@antv/l7-scene';
import regl from 'l7regl';
import { IMapOptions } from '@antv/l7-map';
import { Map } from '@antv/l7-maps';

export function TestScene(options?: Partial<IMapOptions>) {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  const body = document.querySelector('body') as HTMLBodyElement;
  body.appendChild(el);

  const context = createContext(400, 300);
  const reGL = regl(context);
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
