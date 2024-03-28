import { RasterLayer, Scene, Source } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import * as Lerc from 'lerc';

const colorList = [
  '#fff7fb',
  '#ece7f2',
  '#d0d1e6',
  '#a6bddb',
  '#74a9cf',
  '#3690c0',
  '#0570b0',
  '#045a8d',
  '#023858',
];
const positions = [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0];
const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [90.268, 35.3628],
    zoom: 3,
  }),
});

scene.on('loaded', () => {
  const layer = new RasterLayer();
  const tileSource = new Source(
    'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}',
    {
      parser: {
        type: 'rasterTile',
        dataType: 'arraybuffer',
        tileSize: 256,
        format: async (data) => {
          const image = Lerc.decode(data);
          return {
            rasterData: image.pixels[0],
            width: image.width,
            height: image.height,
          };
        },
      },
    },
  );

  layer.source(tileSource).style({
    domain: [0, 1024],
    clampLow: true,
    rampColors: {
      colors: colorList,
      positions,
    },
  });

  scene.addLayer(layer);
  return '';
});

const wrap = document.getElementById('map');
const legend = document.createElement('div');

const data = [];
for (let i = 0; i < colorList.length; i++) {
  data.push({
    color: colorList[i],
    text: positions[i],
  });
}
const strArr = [];
data.map(({ color, text }) => {
  strArr.push(`  <div style="display:inline-block;background:#fff;padding:5px;">
  <div style="fontSize:12px;lineHeight:12px;">
    ${text}
  </div>
  <div style="width: 30px;height:8px; background: ${color};"></div>
  </div>`);
  return '';
});
legend.innerHTML = strArr.join('');
legend.style.position = 'absolute';
legend.style.left = '10px';
legend.style.bottom = '30px';
legend.style.background = '#fff';
legend.style.zIndex = 10;

wrap.appendChild(legend);
