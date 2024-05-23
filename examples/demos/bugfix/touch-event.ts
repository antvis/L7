import { PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const touchEvent: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [-96, 37.8],
      zoom: 3,
    },
  });

  const data = await fetch(
    'https://mdn.alipayobjects.com/afts/file/A*CFbnRqXpg8wAAAAAAAAAAAAADrd2AQ/test.json',
  ).then((res) => res.json());

  const layer = new PolygonLayer({ autoFit: true })
    .source(data)
    .color('#f00')
    .shape('fill')
    .active(true);

  scene.addLayer(layer);
  // layer.on('touchstart',(e)=>{
  //     console.log('touchstart',e)

  // })

  // layer.on('touchend',(e)=>{
  //     console.log('touchend',e)

  // })
  // layer.on('panmove',(e)=>{
  //     console.log('touchmove',e)

  // })
  layer.on('touchmove', (e) => {
    console.log('touchmove', e);
  });

  // layer.on('mouseup',()=>{
  //     alert('mouseup')

  // })

  return scene;
};
