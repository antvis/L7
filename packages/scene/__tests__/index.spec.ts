// @ts-ignore
import { TestScene } from '@antv/l7-test-utils';

describe('template', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  const body = document.querySelector('body') as HTMLBodyElement;
  body.appendChild(el);
  const scene = TestScene({});

  it('scene map status', async () => {
    expect(scene.getZoom()).toEqual(3);
    expect(scene.getMinZoom()).toEqual(-2);
    expect(scene.getMaxZoom()).toEqual(22);
    expect(scene.getType()).toEqual('default');
    expect(scene.getBounds()).toEqual([
      [92.61570169583138, 18.27006017947646],
      [127.7719516958324, 40.94589761553888],
    ]);
  });
});
