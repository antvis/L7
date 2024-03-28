// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';

async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image1 = await tiff.getImage();
  const bandsValues = await image1.readRasters();
  return bandsValues;
}

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [130.5, 47],
    zoom: 10.5,
  }),
});

scene.on('loaded', async () => {
  const url2 = 'https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&';

  const layer2 = new RasterLayer({
    zIndex: 1,
  }).source(url2, {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      wmtsOptions: {
        layer: 'img',
        tileMatrixset: 'w',
        format: 'tiles',
      },
    },
  });
  scene.addLayer(layer2);
  const url1 = 'https://gw.alipayobjects.com/zos/raptor/1667832825992/LC08_3857_clip_2.tif';
  const bandsValues = await getTiffData(url1);

  const layer = new RasterLayer({ zIndex: 10 });
  layer
    .source(bandsValues, {
      parser: {
        type: 'rgb',
        bands: [3, 2, 1], // 从零开始
        width: bandsValues.width,
        height: bandsValues.height,
        extent: [130.39565357746957, 46.905730725742366, 130.73364094187343, 47.10217234153133],
      },
    })
    .style({
      opacity: 1,
    });
  scene.addLayer(layer);
});
