// @ts-ignore
import { LineLayer, PolygonLayer, RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import * as GeoTIFF from 'geotiff';
import React, { useEffect } from 'react';

async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
  );
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.268, 30.3628],
        zoom: 3,
      }),
    });

    scene.on('loaded', async () => {

      const minLng = 110;
      const minLat = 25;
      const maxLng = 120;
      const maxLat = 35;
      const points = [minLng, minLat, maxLng, maxLat];

      
    

      const polygon = new PolygonLayer({ visible: true })
        .source({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    
                    [maxLng, maxLat],
                    [maxLng, minLat],
                    [minLng, minLat],
                    [maxLng, maxLat],
                  ],
                ],
              },
            },
          ],
        })
        .shape('fill')
        .color('#ff0')
        .style({
          opacity: 0.5,
        });
      scene.addLayer(polygon);

     
      const polygon2 = new PolygonLayer({ visible: true })
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [minLng, maxLat],
                  [maxLng, minLat],
                  [minLng, minLat],
                  [minLng, maxLat],
                ],
              ],
            },
          },
        ],
      })
      .shape('fill')
      .color('#f00')
      .style({
        opacity: 0.5,
      });
      scene.addLayer(polygon2);

      const tiffdata = await getTiffData();
      const tiff = await GeoTIFF.fromArrayBuffer(tiffdata);
      const image = await tiff.getImage();
      const width = image.getWidth();
      const height = image.getHeight();
      const values = await image.readRasters();

      const layer = new RasterLayer({
        maskLayers: [polygon]
      });
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
      



      const line = new LineLayer()
        .source({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [minLng, maxLat],
                    [maxLng, maxLat],
                    [maxLng, minLat],
                    [minLng, minLat],
                    [minLng, maxLat],
                  ],
                ],
              },
            },
          ],
        })
        .size(2)
        .shape('line')
        .color('#f00');
      scene.addLayer(line);

      setTimeout(() => {
        const rect = [110, 25, 120, 35];
        const triangle = [110, 35, 120, 25, 110, 25, 110, 35];

        
        layer
          // .pickData(rect)
          .pickData(triangle)
          .then((res) => {
            console.log('pickData', res[0])
            // console.log('pickData', JSON.stringify(res[0].filterData));
            // console.log('pickData', JSON.stringify(res[0].data))
          });
      
      }, 2000);
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
