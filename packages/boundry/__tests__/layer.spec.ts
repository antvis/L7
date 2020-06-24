import BaseLayer from '../src/layer/baseLayer';
describe('baseLayer', () => {
  it('set option', () => {
    const option = {
      adcode: [],
      data: [
        {
          name: 1,
          code: 2,
        },
        {
          name: 2,
          code: 3,
        },
        {
          name: 3,
          code: 4,
        },
      ],
    };
    // @ts-ignore
    const layer = new BaseLayer(null, option);
    layer.setOption({
      data: [
        {
          name: 1,
          code: 4,
        },
      ],
    });
    // @ts-ignore
    expect(layer.options.data.length).toBe(1);
  });
});
