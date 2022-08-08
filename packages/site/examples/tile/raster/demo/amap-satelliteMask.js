import { Scene, RasterLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  stencil: true,
  map: new Map({
    center: [ 120, 30 ],
    zoom: 6.5
  })
});

scene.on('loaded', () => {

  fetch(
    // 'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    'https://gw.alipayobjects.com/os/bmw-prod/ecd1aaac-44c0-4232-b66c-c0ced76d5c7d.json'
  )
    .then(res => res.json())
    .then(data => {
      // 影像底图服务
      const baseLayer = new RasterLayer({
        zIndex: 1,
        mask: true,
        maskfence: data
      });
      baseLayer.source(
        'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        {
          parser: {
            type: 'rasterTile',
            tileSize: 256,
            zoomOffset: 0
          }
        }
      );

      scene.addLayer(baseLayer);
    });


  // 影像注记服务
  const annotionLayer = new RasterLayer({
    zIndex: 2
  });
  annotionLayer.source(
    'https://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        // minZoom: 6,
        // maxZoom: 15,
        zoomOffset: 0
        // extent: [-180, -85.051129, 179, 85.051129],
      }
    }
  );


  scene.addLayer(annotionLayer);
});
