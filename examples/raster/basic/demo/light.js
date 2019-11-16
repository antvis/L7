
import { Scene } from '@l7/scene';
import { RasterLayer } from '@l7/layers'
import * as GeoTIFF from 'geotiff';
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'light',
  center: [121.2680, 30.3628],
  zoom: 3,
});
 async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/6fd83a0e-50da-4266-94e0-05dec9da1c87.dat',
  );
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters();
  console.log(values);
  return {
    data: values[0],
    width,
    height
  };
}

async function addLayer() {
  const tiffdata = await getTiffData();

  const layer = new RasterLayer({});
  layer
    .source(tiffdata.data, {
      parser: {
        type: 'raster',
        width: tiffdata.width,
        height: tiffdata.height,
        min: 0,
        max: 300,
        extent: [119.871826171875,
              30.0262995822237,  120.50216674804688,
              30.433281874927655]
      },
    })
    .style({
      heightRatio:10,
      opacity: 0.8,
      rampColors: {
        colors: [
          '#002466',
          '#0D408C',
          '#105CB3',
          '#1A76C7',
          '#2894E0',
          '#3CB4F0',
          '#65CEF7',
          '#98E3FA',
          '#CFF6FF',
          '#E8FCFF',
        ],
        positions: [0, 0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1.0],
      },
    });
    return layer;
}
scene.on('loaded', async () =>{
  const layer = await addLayer();
  scene.addLayer(layer);
  scene.render();
})

