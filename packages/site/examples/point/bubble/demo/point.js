import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [ 140.067171, 36.26186 ],
    zoom: 5.32,
    maxZoom: 10
  })
});
scene.on('loaded', () => {
  const plane = initPlane();
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json'
  )
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data)
        .shape('circle')
        .size('mag', [ 1, 25 ])
        .color('mag', mag => {
          return mag > 4.5 ? '#5B8FF9' : '#5CCEA1';
        })
        .active(true)
        .style({
          opacity: 0.3,
          strokeWidth: 1
        });
      scene.addLayer(pointLayer);
      pointLayer.on('click', e => {
        const { lng, lat } = e.lngLat;
        scene.setCenter([ lng, lat ], {
          padding: {
            right: 120
          }
        });
        plane.style.right = '0px';
        plane.innerHTML = `
          <p>click info</>
          <p>featureId: ${e.featureId}</p>
          <p>lng: ${lng}</p>
          <p>lat: ${lat}</p>
        `;
      });
      pointLayer.on('unclick', () => {
        plane.style.right = '-120px';
        scene.setCenter([ 140.067171, 36.26186 ], {
          padding: {
            right: 0
          }
        });
      });
    });
});

function initPlane() {
  const el = document.createElement('div');
  el.style.background = '#fff';
  el.style.position = 'absolute';
  el.style.padding = '10px';
  el.style.top = '0';
  el.style.right = '-120px';
  el.style.width = '100px';
  el.style.height = '100%';
  el.style.zIndex = '10';
  el.style.transition = '0.5s';
  // el.innerText = '123'
  const wrap = document.getElementById('map');
  wrap.appendChild(el);
  return el;
}
