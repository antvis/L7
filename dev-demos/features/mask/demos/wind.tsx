// @ts-ignore
import { Scene, WindLayer,PolygonLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new GaodeMap({
        center: [105.732421875, 32.24997445586331],
        pitch: 0,
        style: 'light',
        zoom: 2,
      }),
    });

    const maskData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [125.15625000000001, 8.407168163601076],
                  [116.54296874999999, -21.289374355860424],
                  [156.26953125, -20.632784250388013],
                  [150.29296875, 2.1088986592431382],
                ],
              ],
              [
                [
                  [78.57421875, 46.92025531537451],
                  [51.67968749999999, 37.020098201368114],
                  [87.890625, 28.76765910569123],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      const polygonLayer = new PolygonLayer({
        visible: false,
      }).source(maskData).shape('fill').color('#f00').style({opacity:0.3});
      const layer = new WindLayer({
        maskLayers: [polygonLayer],
        zIndex: 2,
      });
      layer
        .source(
          'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*wcU8S5xMEDYAAAAAAAAAAAAAARQnAQ',
          {
            parser: {
              type: 'image',
              extent: [-180, -85, 180, 85],
            },
          },
        )
        .animate(true)
        .style({
          uMin: -21.32,
          uMax: 26.8,
          vMin: -21.57,
          vMax: 21.42,
          numParticles: 35535,
          fadeOpacity: 0.996,
          sizeScale: 1.2,
          rampColors: {
            0.0: '#c6dbef',
            0.1: '#9ecae1',
            0.2: '#6baed6',
            0.3: '#4292c6',
            0.4: '#2171b5',
            0.5: '#084594',
          },
        });
      scene.addLayer(layer);
      scene.addLayer(polygonLayer);
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
