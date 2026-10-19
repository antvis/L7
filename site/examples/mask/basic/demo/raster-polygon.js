import { PolygonLayer, RasterLayer, Scene, Source } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';

const colorList = [
  '#419bdf', // Water

  '#358221', // Tree

  '#88b053', // Grass

  '#7a87c6', // vegetation

  '#e49635', // Crops

  '#dfc35a', // shrub

  '#ED022A', // Built Area

  '#EDE9E4', // Bare ground

  '#F2FAFF', // Snow

  '#C8C8C8', // Clouds
];
const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const scene = new Scene({
  id: 'map',

  map: new GaodeMap({
    center: [116, 27],
    zoom: 6,
    style: 'dark',
  }),
});

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json')
    .then((res) => res.json())
    .then((maskData) => {
      const maskPolygon = new PolygonLayer({
        visible: false, // 隐藏maskPolygon
      })
        .source(maskData)
        .shape('fill')
        .color('#f00')
        .style({
          opacity: 0.5,
        });
      const layer = new RasterLayer({
        maskLayers: [maskPolygon],
      });

      const tileSource = new Source(
        'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
        {
          parser: {
            type: 'rasterTile',
            dataType: 'arraybuffer',
            tileSize: 256,
            maxZoom: 13.1,
            format: async (data) => {
              const tiff = await GeoTIFF.fromArrayBuffer(data);
              const image = await tiff.getImage();
              const width = image.getWidth();
              const height = image.getHeight();
              const values = await image.readRasters();
              return { rasterData: values[0], width, height };
            },
          },
        },
      );

      layer.source(tileSource).style({
        domain: [0, 255], // 枚举类型domain 必须为0-255
        clampLow: false,
        rampColors: {
          type: 'cat',
          colors: colorList,
          positions,
        },
      });

      scene.addLayer(layer);
      scene.addLayer(maskPolygon);
      return '';
    });
  return '';
});

const wrap = document.getElementById('map');
const legend = document.createElement('div');

const data = [];
for (let i = 0; i < colorList.length; i += 1) {
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
      'Clouds',
    ][i],
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
