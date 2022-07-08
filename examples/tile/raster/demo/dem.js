import { Scene, RasterLayer, Source } from '@antv/l7';
import { Map } from '@antv/l7-maps';
const colorList = [
  '#f7fcf5',
  '#e5f5e0',
  '#c7e9c0',
  '#a1d99b',
  '#74c476',
  '#41ab5d',
  '#238b45',
  '#006d2c',
  '#00441b'
];
const positions = [ 0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0 ];
const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [ 90.268, 35.3628 ],
    zoom: 3
  })
});

const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d');

scene.on('loaded', () => {

  const layer = new RasterLayer();
  const tileSource = new Source('https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    {
      parser: {
        type: 'rasterTile',
        dataType: 'arraybuffer',
        tileSize: 256,
        minZoom: 1,
        maxZoom: 18,
        zoomOffset: 0,
        format: async data => {
          const blob = new Blob([ new Uint8Array(data) ], {
            type: 'image/png'
          });
          const img = await createImageBitmap(blob);
          ctx.clearRect(0, 0, 256, 256);
          ctx.drawImage(img, 0, 0, 256, 256);

          const imgData = ctx.getImageData(0, 0, 256, 256).data;
          const arr = [];
          for (let i = 0; i < imgData.length; i += 4) {
            const R = imgData[i];
            const G = imgData[i + 1];
            const B = imgData[i + 2];
            const d = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;
            arr.push(d);
          }
          return {
            rasterData: arr,
            width: 256,
            height: 256
          };
        }
      }
    });
  layer.source(tileSource)
    .style({
      domain: [ 0, 1024 ],
      clampLow: true,
      rampColors: {
        colors: colorList,
        positions
      }
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
    text: positions[i]
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
