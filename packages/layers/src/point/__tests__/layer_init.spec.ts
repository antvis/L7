// @ts-ignore
import { TestScene } from '@antv/l7-test-utils';
import PointLayer from '../';

describe('template', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  const body = document.querySelector('body') as HTMLBodyElement;
  body.appendChild(el);
  const scene = TestScene({});
  const testData = [
    {
      x: 112,
      y: 30,
      name: 'text1',
      v: 10,
    },
    {
      x: 112,
      y: 32,
      name: 'text2',
      v: 20,
    },
  ];

  it('scene layer fill', async () => {
    const layer = new PointLayer()
      .source(testData, {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y',
        },
      })
      .shape('circle')
      .color('red')
      .size(10);
    scene.on('loaded', () => {
      scene.addLayer(layer);
    });
  });

  it('scene layer text', async () => {
    const layer = new PointLayer({ name: 'text' })
      .source(testData, {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y',
        },
      })
      .shape('name', 'text')
      .color('name', ['red', 'blue'])
      .size('v', [10, 20]);

    scene.on('loaded', () => {
      scene.addLayer(layer);
      expect(layer.name).toEqual('text');
    });
  });

  it('scene layer extrude', async () => {
    const layer = new PointLayer()
      .source(testData, {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y',
        },
      })
      .shape('cloumn')
      .color('red')
      .size([5, 5, 10]);
    scene.on('loaded', () => {
      scene.addLayer(layer);
    });
  });

  it('scene layer simplePoint', async () => {
    const layer = new PointLayer()
      .source(testData, {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y',
        },
      })
      .shape('simple')
      .color('red')
      .size(1);
    scene.on('loaded', () => {
      scene.addLayer(layer);
    });
  });
});
