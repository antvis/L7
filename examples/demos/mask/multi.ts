import { PolygonLayer, RasterLayer } from '@antv/l7';
import * as GeoTIFF from 'geotiff';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

const leftMaskGeoData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [66.253425, 11.475926],
            [66.253425, 55.29063],
            [105.028662, 55.29063],
            [105.028662, 11.475926],
            [66.253425, 11.475926],
          ],
        ],
      },
    },
  ],
};

export const multi: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const aqi1 = await getTiffData(
    'https://static.sencdn.com/stargazer/tiffs/forecast_aqi/2024020200_2024020211.tiff',
  );

  const json = await (
    await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    )
  ).json();

  const polygonLayer = new PolygonLayer({
    visible: true,
    name: 'china',
  })
    .source(json)
    .shape('fill')
    .color('#f00')
    .style({ opacity: 0.1 });

  const maskLayer = new PolygonLayer({
    visible: false,
    name: 'rect',
  })
    .source(leftMaskGeoData)
    .shape('fill')
    .color('red')
    .style({
      opacity: 0.1,
    });

  const leftLayer = new RasterLayer({
    autoFit: true,
    maskLayers: [polygonLayer],
    //   maskLayers: [polygonLayer, maskLayer],
  })
    .source(aqi1.data, {
      parser: {
        type: 'raster',
        width: aqi1.width,
        height: aqi1.height,
        extent: [73, 17, 135.95, 53.95],
      },
    })
    .style({
      clampLow: false,
      clampHigh: false,
      domain: [-0, 500],
      opacity: 0.8,
      rampColors: {
        type: 'linear',
        colors: ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a'].reverse(),
        positions: [0, 50, 100, 150, 300, 500],
      },
    });

  leftLayer.addMask(maskLayer);

  scene.addLayer(leftLayer);
  scene.addLayer(polygonLayer);
  scene.addLayer(maskLayer);

  return scene;
};

async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters();
  return {
    data: values[0],
    width,
    height,
  };
}
