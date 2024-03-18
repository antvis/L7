// @ts-ignore
import { Scene, PolygonLayer, PointLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
 
  map: new GaodeMap({
    center: [112, 30],
    zoom: 3,
  }),
});

const layer = new PolygonLayer({
  featureId: 'COLOR',
  sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
});
layer
  .source(
    'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
    {
      parser: {
        type: 'mvt',
        tileSize: 256,
        maxZoom: 9,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    },
  )
  // .shape('line')
  .color('COLOR')
  // .active(true)
  .size(10)
  .select(true)

  .style({
    // opacity: 0.3
  });

const point = new PointLayer({ zIndex: 1 })
  .source(
    [
      {
        lng: 120,
        lat: 30,
      },
    ],
    {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    },
  )
  .shape('circle')
  .size(40)
  .active(true)
  .color('#f00');

scene.on('loaded', () => {
  scene.addLayer(layer);

  setTimeout(() => {
    point.setData([
      {
        lng: 123,
        lat: 30,
      },
    ]);

    point.color('#ff0');
    scene.render();
    console.log('update');
  }, 3000);
  // layer.on('inited', () => {
  //   console.log(
  //     'layer.getLayerConfig().enableHighlight',
  //     layer.getLayerConfig().enableHighlight,
  //   );
  // });

  layer.on('click', (e) => {
    console.log('click');
    console.log(e);
  });

  scene.addLayer(point);
});
