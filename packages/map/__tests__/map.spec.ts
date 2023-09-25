import { Map } from '../src/map';
describe('Map', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  // el.style.width = '500px';
  // el.style.height = '500px';
  el.style.background = '#aaa';
  document.querySelector('body')?.appendChild(el);
  it('init Map', () => {
    new Map({
      container: el,
    });
  });
});
