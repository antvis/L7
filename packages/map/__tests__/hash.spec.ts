import Hash from '../src/hash';
import { Map } from '../src/map';
describe('Map', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  // el.style.width = '500px';
  // el.style.height = '500px';
  el.style.background = '#aaa';
  let map: Map;
  let hash: Hash;
  document.querySelector('body')?.appendChild(el);
  beforeEach(() => {
    map = new Map({
      container: el,
    });
    hash = new Hash('map');
    hash.addTo(map);
  });
  it('hash update', () => {
    map.setZoom(10);
    map.setBearing(10);
    map.setPitch(10);
    map.setCenter([0, 0]);
    expect(window.location.hash).toEqual('#map=10/0/0');
  });

  it('hash remove', () => {
    hash.remove();
    // @ts-ignore
    expect(hash.map).toEqual(undefined);
  });
  it('hash onHashChange', () => {
    window.location.hash = '#map=11/10/10';
    hash.onHashChange();
    expect(map.getZoom()).toEqual(11);
    expect(map.getCenter()).toEqual({ lng: 10, lat: 10 });
  });
});
