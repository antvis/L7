import { Scene, RasterLayer, Source } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';

const colorList = [
  '#419bdf', // Water
  '#419bdf',

  '#397d49', // Tree
  '#397d49',

  '#88b053', // Grass
  '#88b053',

  '#7a87c6', // vegetation
  '#7a87c6',

  '#e49635', // Crops
  '#e49635',

  '#dfc35a', // shrub
  '#dfc35a',

  '#c4281b', // Built Area
  '#c4281b',

  '#a59b8f', // Bare ground
  '#a59b8f',

  '#a8ebff', // Snow
  '#a8ebff',

  '#616161', // Clouds
  '#616161'
];
const positions = [
  0.0,
  0.1,
  0.1,
  0.2,
  0.2,
  0.3,
  0.3,
  0.4,
  0.4,
  0.5,
  0.5,
  0.6,
  0.6,
  0.7,
  0.7,
  0.8,
  0.8,
  0.9,
  0.9,
  1.0
];

const scene = new Scene({
  id: 'map',
  stencil: true,
  map: new GaodeMap({
    center: [ 116, 27 ],
    zoom: 6,
    style: 'dark'
  })
});

scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json'
  )
    .then(res => res.json())
    .then(maskData => {
      const layer = new RasterLayer({
        mask: true,
        maskfence: maskData
      });

      const tileSource = new Source('https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
        {
          parser: {
            type: 'rasterTile',
            dataType: 'arraybuffer',
            tileSize: 256,
            maxZoom: 13.1,
            format: async data => {
              const tiff = await GeoTIFF.fromArrayBuffer(data);
              const image = await tiff.getImage();
              const width = image.getWidth();
              const height = image.getHeight();
              const values = await image.readRasters();
              return { rasterData: values[0], width, height };
            }
          }
        });

      layer.source(tileSource)
        .style({
          domain: [ 0.001, 11.001 ],
          clampLow: false,
          rampColors: {
            colors: colorList,
            positions
          }
        });

      scene.addLayer(layer);
      return '';
    });
  return '';
});

const wrap = document.getElementById('map');
const legend = document.createElement('div');

const data = [];
for (let i = 0; i < colorList.length; i += 2) {
  data.push({
    color: colorList[i],
    text: [
      'Water',
      'Trees',
      'Grass',
      'Vegetation',
      'Crops',
      'Shrub',
      'Built Area',
      'Bare ground',
      'Snow',
      'Clouds'
    ][i / 2]
  });
}
const strArr = [];
data.map(({ color, text }) => {
  strArr.push(`  <div style="display:inline-block;background:#fff:padding:5px;">
  <div style="fontSize:12px;lineHeight:12px;color: #fff">
    ${text}
  </div>
  <div style="height:8px; background: ${color};"></div>
  </div>`);
  return '';
});
legend.innerHTML = strArr.join('');
legend.style.position = 'absolute';
legend.style.left = '10px';
legend.style.bottom = '30px';
legend.style.zIndex = 10;

wrap.appendChild(legend);

