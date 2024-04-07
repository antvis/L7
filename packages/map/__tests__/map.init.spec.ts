import { Map } from '../src/map';
describe('Map', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  // el.style.width = '500px';
  // el.style.height = '500px';
  el.style.background = '#aaa';
  let map: Map;
  document.querySelector('body')?.appendChild(el);
  beforeEach(() => {
    map = new Map({
      container: el,
    });
  });
  it('should resize correctly', () => {
    // 创建Map的实例，将mock的Map传

    // map.resize();
    map.setCenter([120.11114550000002, 30.27817071635984]);
    map.setZoom(8.592359444611867);

    // 验证transform.resize方法是否被正确调用
  });
});
