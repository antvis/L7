// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
import React, { useEffect } from 'react';
const googleUrl = 'https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'

async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
  );
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}
// x=340654&y=470897&z=20

function tileXYZToLatLng(x, y, z) {
    const n = 2 ** z;
    const lon_deg = x / n * 360.0 - 180.0;
    const lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
    const lat_deg = lat_rad * 180.0 / Math.PI;
    return [lon_deg, lat_deg];
  }

  async function readCogInBoundingBox(cogUrl:string, boundingBox:number[]) {
    // const response = await fetch(cogUrl);
    // const arrayBuffer = await response.arrayBuffer();
    console.log(GeoTIFF);
    const tiff = await GeoTIFF.fromUrl(cogUrl);
   // https://github.com/geotiffjs/cog-explorer/blob/master/src/actions/scenes/index.js#L136
    const image = await tiff.getImage()
    const width = image.getTileWidth(); // Read the first image\
    const height = image.getTileHeight(); // Read the first image\
    const samples = image.getSamplesPerPixel();
    const bands = {};
    for (let i = 0; i < samples; ++i) {
        bands[i] = cogUrl;
    }
  
    let [red, green, blue] = [0,0,0];
    if (samples === 3 || typeof image.fileDirectory.PhotometricInterpretation !== 'undefined') {
      red = 0;
      green = 1;
      blue = 2;
    }

    const isRGB = (
      typeof image.fileDirectory.PhotometricInterpretation !== 'undefined'
      && image.getSampleByteSize(0) === 1
    );
    console.log(isRGB);

    // Calculate the window based on the bounding box
    const box = image.getBoundingBox(boundingBox);
  
    // const width = box.width();
    // const height = box.height();
    // const data = await image.readRasters({ box });
  
    // You can now work with the 'data', 'width', and 'height' within the specified bounding box
    // console.log(data);
    // console.log(width, height);
  }

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [-63.0484356,18.0251617],
        zoom: 18,
      }),
    });

    const googleMap = new RasterLayer({
        zIndex: 1,
      }).source(googleUrl, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
        },
      });

    scene.on('loaded', async () => {
      const cogUrl = 'http://127.0.0.1:8080/7ad397c0-bba2-4f98-a08a-931ec3a6e943.tiff'
      const [minx,maxY] = tileXYZToLatLng(340654,470897,20)
      const [maxX,minY] = tileXYZToLatLng(340654 + 1,470897 + 1,20);
      const boundingBox = [minx,minY,maxX,maxY];
      console.time('readCogInBoundingBox');
      await readCogInBoundingBox(cogUrl,boundingBox);
      console.timeEnd('readCogInBoundingBox');

      // Read the COG file within the specified bounding box

      scene.addLayer(googleMap);
      const tiffdata = await getTiffData();
      const tiff = await GeoTIFF.fromArrayBuffer(tiffdata);
      const image = await tiff.getImage();
      const width = image.getWidth();
      const height = image.getHeight();
      const values = await image.readRasters();

      const layer = new RasterLayer();
      layer
        .source(values[0], {
          parser: {
            type: 'raster',
            width,
            height,
            extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
          },
        })
        .style({
          opacity: 1.0,
          clampLow: false,
          clampHigh: false,
          domain: [100, 8000],
          rampColors: {
            colors: [
              '#FF4818',
              '#F7B74A',
              '#FFF598',
              '#91EABC',
              '#2EA9A1',
              '#206C7C',
            ].reverse(),
            positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          },
        });

      scene.addLayer(layer);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
