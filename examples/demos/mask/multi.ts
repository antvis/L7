import * as allMap from '@antv/l7-maps';
import { Map, RasterLayer, PolygonLayer, Scene, Swipe } from '@antv/l7';
import * as GeoTIFF from 'geotiff';

async function getTiffData(url: string) {
    const response = await fetch(
      url
    );
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
  
  const leftMaskGeoData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [66.253425, 11.475926],
              [66.253425, 55.29063],
              [105.028662, 55.29063],
              [105.028662, 11.475926],
              [66.253425, 11.475926]
            ]
          ]
        }
      }
    ]
  }

export function MapRender(option: {
    map: string
    renderer: 'regl' | 'device'
}) {

    const scene = new Scene({
        id: 'map',
      renderer: option.renderer,
        map: new allMap[option.map || 'Map']({
            style: 'light',
            center: [121.434765, 31.256735],
            zoom: 14.83
        })
    });


scene.on('loaded', async () => {
    const colors = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'];
    const aqi1 = await getTiffData('https://static.sencdn.com/stargazer/tiffs/forecast_aqi/2024020200_2024020211.tiff');
  
    const json = await (await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    )).json();
  
  
    // 影像地图图层
    const baseLayer = new RasterLayer({ zIndex: -1 }).source(
      'https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
      {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
        },
      },
    );
  
    const polygonLayer = new PolygonLayer({
      visible: true,
      name:'china',
    }).source(json).shape('fill').color('#f00').style({ opacity: 0.1 });
  
    const maskLayer = new PolygonLayer({
      visible: false,
      name:'rect',
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
    }).source(aqi1.data, {
      parser: {
        type: 'raster',
        width: aqi1.width,
        height: aqi1.height,
        extent: [73, 17, 135.95, 53.95],
      }
    })
      .style({
        clampLow: false,
        clampHigh: false,
        domain: [-0, 500],
        opacity: 0.8,
        rampColors: {
          type: 'linear',
          colors: ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a',].reverse(),
          positions: [0, 50, 100, 150, 300, 500],
        },
      });
  
    leftLayer.addMask(maskLayer);
  
  
    scene.addLayer(baseLayer);
  
    scene.addLayer(leftLayer);
    scene.addLayer(polygonLayer);
    scene.addLayer(maskLayer)
  
  });
  

}
