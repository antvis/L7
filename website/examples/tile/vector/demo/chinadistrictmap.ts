// @ts-ignore
import { Scene, Source, PolygonLayer, LineLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
 
  map: new Map({
    zoom: 4.5,
    center: [116.412427, 39.303573],
  }),
});

const url =
  'https://mvt.amap.com/district/CHN3/{z}/{x}/{y}/4096?key=309f07ac6bc48160e80b480ae511e1e9&version=';
const source = new Source(url, {
  parser: {
    type: 'mvt',
    tileSize: 256,
    warp: false,
  },
});

scene.on('loaded', () => {
  const colors = {};
  const getColorByAdcode = function (adcode) {
    if (!colors[adcode]) {
      const gb = Math.floor(Math.random() * 155 + 50);
      colors[adcode] = 'rgb(' + gb + ',' + gb + ',255)';
    }

    return colors[adcode];
  };
  // 绿地
  const fill = new PolygonLayer({
    sourceLayer: 'CHN_Districts',
  })
    .source(source)
    .shape('fill')
    .color('adcode', getColorByAdcode);

  const line = new LineLayer({
    sourceLayer: 'CHN_Districts_L',
  })
    .source(source)
    .shape('simple')
    .color('#fee0d2');

  const line2 = new LineLayer({
    sourceLayer: 'CHN_Citys_L',
  })
    .source(source)
    .shape('line')
    .size(0.6)
    .color('#fc9272');

  const line3 = new LineLayer({
    sourceLayer: 'CHN_Provinces_L',
  })
    .source(source)
    .shape('line')
    .size(0.6)
    .color('#de2d26');

  scene.addLayer(fill);
  scene.addLayer(line);
  scene.addLayer(line2);
  scene.addLayer(line3);
  //   scene.addLayer(line2);
  // const debugerLayer = new TileDebugLayer({ usage: 'basemap' });
  // scene.addLayer(debugerLayer);
});
